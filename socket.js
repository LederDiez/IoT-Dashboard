'user strict' //RFC 6455

const webSocketServer = require('websocket').server;
const colors          = require('colors');
const http            = require('http');
const CryptoJS        = require("crypto-js");

var server = http.createServer(function(request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});
 
server.listen(9300, () => {
    console.log("SOCKET SERVER STARTED!!!".red);
});

/**
 * WebSocket server
 *  WebSocket server is tied to a HTTP server. WebSocket
 *  request is just an enhanced HTTP request. For more info 
 *  http://tools.ietf.org/html/rfc6455#page-6
 */
var wsServer = new webSocketServer({
    httpServer: server
});

var clients = [];

wsServer.on('request', (req) => {

    // Variables con valores propios de cada cliente
    var connection = req.accept(null, req.origin);
    var serial     = null;
    var type       = null;
    var encryptSerial = req.resourceURL.query.value;

    if (connection == null) {
        req.reject();
        console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
    }

    type = 'device';
    connection.CType   = type;
    connection.CSerial = null;
    
    if (encryptSerial != null) {

        // Soluciona el problema de el caracter "+" que no se puede enviar por get
        encryptSerial = encryptSerial.replace(/ /g, "+");

        // Decrypt
        var bytes  = CryptoJS.AES.decrypt(encryptSerial, 'Fv55xh2JWJP25eW');
        var decryptSerial = bytes.toString(CryptoJS.enc.Utf8);

        type   = 'user';
        connection.CType   = type;
        serial = decryptSerial;
        connection.CSerial = serial;

    }

    // we need to know client index to remove them on 'close' event
    var index = clients.push(connection) - 1;

    console.log(`${(new Date())} Connection accepted.`.bgGreen);
    console.log(`There are ${clients.length} clients connected.`.bgBlue);

    // user or device sent some message
    connection.on('message', (message) => {
        if (message.type === 'utf8') {
            if (connection.CSerial == null) {
                serial = message.utf8Data;
                if (clients[index] != null) {
                    clients[index].CSerial = serial;
                } else {
                    //
                }
            } else {
                if (type == "client") {
                    for (var i = 0; i < clients.length; i++) {
                        if (clients[i].CType == 'device' && clients[i].CSerial == serial) {
                            clients[i].sendUTF(message.utf8Data);
                        }
                    }
                } else {
                    var data = message.utf8Data;
                    for (var i = 0; i < clients.length; i++) {
                        if (clients[i].CType == 'user' && clients[i].CSerial == serial) {
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
        clients.splice(index, 1);

        console.log(`${(new Date())} Client disconnected.`.bgRed);
        console.log(`There are ${clients.length} clients connected.`.bgBlue);
    });

    connection.on('error', function(error) {
        console.log(`Connection Error: ${error.toString()}`.red);
    });
});