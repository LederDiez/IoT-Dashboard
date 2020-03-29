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

const session    = require('express-session');
const MongoStore = require('connect-mongo')(session);

const db         = require('./models/session_conecction');
const web_router = require('./routers/web');
const api_router = require('./routers/api');

const fs         = require('fs');
const http       = require('http');
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
        maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
    },
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({ 
        mongooseConnection: db
    })
}));

// Route https
app.use(function (req, res, next) {
    // The 'x-forwarded-proto' check is for Heroku
    if (!req.secure && req.get('x-forwarded-proto') !== 'https' && process.env.NODE_ENV !== "development") {
        return res.redirect('https://' + req.get('Host') + req.url);
    }
    next();    
});

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

var httpServer = http.createServer(app);
var httpsServer = https.createServer({
    key: fs.readFileSync('./tls/key.pem'),
    cert: fs.readFileSync('./tls/csr.pem')
}, app);

httpServer.listen(80, () => {
    console.log('WEB SERVER HTTP STARTED!!!'.red);
});
httpsServer.listen(443, () => {
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