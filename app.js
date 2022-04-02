'user strict'

const webpush         = require("web-push");

const {PUBLIC_VAPID_KEY, PRIVATE_VAPID_KEY, PORT, NODE_ENV, SERIAL_CRYPTO_KEY}= require('./config/config');
const { SessionStore } = require('./models/connection_models');
const controlers = require('./controllers/controllers');

const { DevicesModel, UserModel, DevicesDataSchema } = require('./models/connection_models');
const webSocketServer = require('websocket').server;
const CryptoJS        = require("crypto-js");
const http            = require('http');
const mongoose   = require('mongoose');

const bodyParser = require('body-parser');
const express    = require('express');
const morgan     = require('morgan');
const colors     = require('colors');
const path       = require('path');

const app = express();

// settings
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('port', PORT);

// middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(SessionStore);

// static files
app.use(express.static('public'));
app.use(express.static('views'));

var notification;

// Route https
app.use(function (req, res, next) {
    // The 'x-forwarded-proto' check is for Heroku
    if (!req.secure && req.get('x-forwarded-proto') !== 'https' && NODE_ENV !== "development") {
        return res.redirect('https://' + req.get('Host') + req.url);
    }
    next();    
});

// routers
app.use(controlers);

webpush.setVapidDetails (
    'mailto:lederdiez00@gmail.com',
    PUBLIC_VAPID_KEY,
    PRIVATE_VAPID_KEY
);

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

const mqtt = require('mqtt')
const client  = mqtt.connect('mqtt://192.168.2.110:1883', {
    username : 'testuser',
    password : 'testpass'})

client.on('connect', function () {
  client.subscribe('#', function (err) {
    if (!err) {
      client.publish('presence', 'Hello mqtt')
    }
  })
})

client.on('message', function (topic, message) {
  // message is Buffer
  console.log(message.toString())
})

//////////////////////////////////////////////////////////////////////////////////////

var wsServer = new webSocketServer({
    httpServer: httpServer
});

// Todos los clientes conectados
var clients = new Array();

// Todos los dispositivos conectados
var devices = new Array();

wsServer.on('request', (req) => {

    // Variables con valores propios de cada cliente
    var type = req.resourceURL.query.type || null;
    var connection;

    // Make sure we only accept requests from an allowed origin
    if (type == null) {
        req.reject();
        console.log(`${new Date()} Connection from origin ${req.origin} rejected.`.bgRed);
        return;
    }

    connection = req.accept(null, req.origin);
    connection.type   = type;

    // user or device sent some message
    connection.on('message', (message) => {
        if (message.type === 'utf8') {

            if (connection.type == "user" && connection.serial == null) {
                const filter = { uuid: message.utf8Data };
                const update = { uuid: '' };

                UserModel.findOneAndUpdate(filter, update, {new: true}, function(err, data) {
                    if (err) {
                        error = true;
                    } else {
                        connection.serial = data.deviceAuth;

                        clients.push(connection) - 1;
                        console.log(`${(new Date())} Connection accepted from user serial ${(connection.serial)}.`.bgGrey);
                        console.log(`There are ${clients.length} clients connected.`.bgBlue);
                    }
                });
            } else if (connection.type == "device" && connection.serial == null) {
                
                const filter = { uuid: message.utf8Data };
                const update = { uuid: '' };

                DevicesModel.findOneAndUpdate(filter, update, {new: true}, function(err, data) {
                    if (err) {
                        error = true;
                    } else {
                        connection.serial = data.serialNumber;

                        devices.push(connection) - 1;
                        console.log(`${(new Date())} Connection accepted from device serial ${(connection.serial)}.`.bgMagenta);
                        console.log(`There are ${devices.length} devices connected.`.bgBlue);
                    }
                });
            } else {

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
                    
                    let dataModel = mongoose.model('device-' + connection.serial, DevicesDataSchema);
                    let newData = new dataModel();
                    newData.registerDate = Date.now();
                    newData.data = data;
                    newData.save(function (err) {
                        if (err) {
                            console.log('error al guardar datos del dispositivo'.bgRed);
                        };
                        // saved!
                    });
                }

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