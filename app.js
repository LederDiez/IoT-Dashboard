'user strict'

const bodyParser = require('body-parser');
const express    = require('express');
const morgan     = require('morgan');
const colors     = require('colors');
const path       = require('path');

const session    = require('express-session');
const MongoStore = require('connect-mongo')(session);
//const cookieSession = require('cookie-session')

const db         = require('./models/session_conecction');
const web_router = require('./routers/web');
const api_router = require('./routers/api');

const app = express();

// settings
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('port', process.env.PORT || 80);

/*
app.set('trust proxy', 1) // trust first proxy
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}));
*/

// middlewares
//app.use(morgan('dev'));
app.use(morgan('[:date[clf]] :status :method :remote-addr :user-agent :url'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({  
    secret: process.env.SESSION_SECRET || 'ZwL2PX3hfsWSj6j',
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
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

// routers
app.use("/", web_router);
app.use("/api", api_router);
    // Route not found (404)
app.use(function(req, res, next) {
    return res.status(404).sendFile(__dirname + '/views/404.html');
});
    // Any error
app.use(function(err, req, res, next) {
    console.log(err);
    return res.status(500).sendFile(__dirname + '/views/500.html');
});

// start the server
app.listen(app.get('port'), () => {
    console.log('WEB SERVER STARTED!!!'.red);
});

//npm run start_server
//npm run dev_server