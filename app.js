'user strict'

const webSocketServer = require('websocket').server;
const CryptoJS        = require("crypto-js");
const webpush         = require("web-push");

const dotenv     = require('dotenv').config();
const bodyParser = require('body-parser');
const express    = require('express');
const morgan     = require('morgan');
const colors     = require('colors');
const path       = require('path');

const mongoose   = require('mongoose');
const session    = require('express-session');
const MongoStore = require('connect-mongo')(session);
const deviceData = require('./models/device_data_schema');

const db         = require('./models/session_conecction');
const web_router = require('./routers/web');
const api_router = require('./routers/api');

const fs         = require('fs');
const http       = require('http');

const app = express();

webpush.setVapidDetails (
    'mailto:lederdiez00@gmail.com',
    process.env.PUBLIC_VAPID_KEY,
    process.env.PRIVATE_VAPID_KEY
);


// settings
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('port', process.env.PORT || 80);

// middlewares
app.use(morgan('dev'));
//app.use(morgan('[:date[clf]] :status :method :remote-addr :user-agent :url'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({  
    secret: process.env.SESSION_SECRET,
    cookie: {
        maxAge: 604800000 // 1 week
    },
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({ 
        mongooseConnection: db
    })
}));

// static files
app.use(express.static('public'));
app.use(express.static('views'));

var notification;

// Route https
app.use(function (req, res, next) {
    // The 'x-forwarded-proto' check is for Heroku
    if (!req.secure && req.get('x-forwarded-proto') !== 'https' && process.env.NODE_ENV !== "development") {
        return res.redirect('https://' + req.get('Host') + req.url);
    }
    next();    
});

// routers
app.use("/", web_router);
app.use("/api", api_router);

app.use('/consola/subscription', function (req, res) {
    res.status(200).send('Hola mundo!!!');
    notification = req.body;
});

// Route not found (404)
app.use(function(req, res, next) {
    return res.status(404).sendFile(__dirname + '/views/404.html');
});

// Any error
app.use(function(err, req, res, next) {
    console.log(err);
    return res.status(500).sendFile(__dirname + '/views/500.html');
});

var httpServer = http.createServer(app);

httpServer.listen(app.get('port'), () => {
    console.log("WEB SERVER STARTED!!!".red)
    console.log("WEB SOCKET STARTED!!!".red)
});

//////////////////////////////////////////////////////////////////////////////////////

function originIsAllowed(req) {
  
    var type = req.resourceURL.query.type;
    var value = req.resourceURL.query.value;

    if (type != null && value != null) {
        return true;
    } else {
        return false;
    }
}

var wsServer = new webSocketServer({
    httpServer: httpServer
});

// Todos los clientes conectados
var clients = new Array();

// Todos los dispositivos conectados
var devices = new Array();

wsServer.on('request', (req) => {

    if (!originIsAllowed(req)) {
      // Make sure we only accept requests from an allowed origin
      req.reject();
      console.log(`${new Date()} Connection from origin ${req.origin} rejected.`.bgRed);
      return;
    }

    // Variables con valores propios de cada cliente
    var connection = req.accept(null, req.origin);

    var type = req.resourceURL.query.type;
    var value = req.resourceURL.query.value;

    connection.type   = type;
    var encryptSerial = value.replace(/ /g, "+");
    var bytes  = CryptoJS.AES.decrypt(encryptSerial, process.env.SERIAL_CRYPTO_KEY); // Decrypt
    connection.serial = bytes.toString(CryptoJS.enc.Utf8);
    

    if (connection.type == "user") {
        clients.push(connection) - 1;
        console.log(`${(new Date())} Connection accepted from ${(connection.type)} serial ${(connection.serial)}.`.bgGrey);
        console.log(`There are ${clients.length} clients connected.`.bgBlue);
    } else {
        devices.push(connection) - 1;
        console.log(`${(new Date())} Connection accepted from ${(connection.type)} serial ${(connection.serial)}.`.bgMagenta);
        console.log(`There are ${devices.length} devices connected.`.bgBlue);
    }

    // user or device sent some message
    connection.on('message', (message) => {
        if (message.type === 'utf8') {

            if (connection.type == "user") { // Cliente envio un dato
                
                var data = message.utf8Data;
                for (var i = 0; i < devices.length; i++) {
                    if (devices[i].serial == connection.serial) {
                        devices[i].sendUTF(data);
                    }
                }

            } else if (connection.type == "device") { // Dispositivo envio un dato
                
                var data = message.utf8Data;
                for (var i = 0; i < clients.length; i++) {
                    if (clients[i].serial == connection.serial) {
                        clients[i].sendUTF(data);
                    }
                }

                // Guardar historial
                
                let data_schema = mongoose.model('device-' + connection.serial, deviceData);
                let new_data = new data_schema();
                new_data.registerDate = Date.now();
                new_data.data = data;
                new_data.save((err) => {
                    if (err) {
                        console.log('error al guardar datos del dispositivo'.bgRed);
                    }
                });
            }
        }
    });

    connection.on('close', (reasonCode, description) => {
        // remove user or device from the list of connected clients

        if (connection.type == "user") {
            for (var i = 0; i < clients.length; i++) {
                if (clients[i].serial == connection.serial) {
                    clients.splice(i, 1);
                }
            }

            console.log(`${(new Date())} ${connection.type} disconnected.`.bgRed);
            console.log(`There are ${clients.length} clients connected.`.bgBlue);
        } else {
            for (var i = 0; i < devices.length; i++) {
                if (devices[i].serial == connection.serial) {
                    devices.splice(i, 1);
                }
            }

            console.log(`${(new Date())} ${connection.type} disconnected.`.bgRed);
            console.log(`There are ${devices.length} devices connected.`.bgBlue);
        }
    });
});