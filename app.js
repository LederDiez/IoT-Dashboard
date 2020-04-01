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
const https      = require('https');

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

var httpsServer = https.createServer(app);

httpsServer.listen(app.get('port'), () => {
    console.log("WEB SERVER HTTPS STARTED!!!".red)
});

//////////////////////////////////////////////////////////////////////////////////////

var wsServer = new webSocketServer({
    httpServer: httpsServer
});

// Variables con valores globales
var clients = new Array();

wsServer.on('request', (req) => {

    // Variables con valores propios de cada cliente
    var connection = req.accept(null, req.origin);

    if (connection == null) {
        req.reject();
        console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
    }

    connection.type   = 'device';
    connection.serial = null;
    var encryptSerial = req.resourceURL.query.value;
    if (encryptSerial != null) {
        encryptSerial = encryptSerial.replace(/ /g, "+");
        var bytes  = CryptoJS.AES.decrypt(encryptSerial, process.env.SERIAL_CRYPTO_KEY); // Decrypt
        connection.serial = bytes.toString(CryptoJS.enc.Utf8);
        connection.type = 'user';
    }

    clients.push(connection) - 1;
    console.log(`${(new Date())} Connection accepted from ${(connection.type)}.`.bgGreen);
    console.log(`There are ${clients.length} clients connected.`.bgBlue);

    // user or device sent some message
    connection.on('message', (message) => {
        if (message.type === 'utf8') {
            if (connection.serial == null) {
                connection.serial = message.utf8Data; // El primer mensaje enviado por un dispositivo es su serial
            } else {
                if (connection.type == "user") { // Cliente envio un dato
                    var data = message.utf8Data;
                    for (var i = 0; i < clients.length; i++) {
                        if (clients[i].type == 'device' && clients[i].serial == connection.serial) {
                            clients[i].sendUTF(data);
                        }
                    }
                } else if (connection.type == "device") { // Dispositivo envio un dato
                    var data = message.utf8Data;
                    for (var i = 0; i < clients.length; i++) {
                        if (clients[i].type == 'user' && clients[i].serial == connection.serial) {
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
        }
    });

    connection.on('close', (reasonCode, description) => {
        // remove user from the list of connected clients
        for (var i = 0; i < clients.length; i++) {
            if (clients[i].type == connection.type && clients[i].serial == connection.serial) {
                clients.splice(i, 1);
            }
        }
        console.log(`${(new Date())} ${connection.type} disconnected.`.bgRed);
        console.log(`There are ${clients.length} clients connected.`.bgBlue);
    });
});