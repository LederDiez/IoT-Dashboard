'user strict'

const mongoose = require('mongoose');
const colors   = require('colors');

mongoose.set('useUnifiedTopology', true);
mongoose.connect('mongodb+srv://LederDiez:159753852@cluster0-jcmxa.mongodb.net', {
    useCreateIndex: true,
    useNewUrlParser: true
}).then(function () { 
  console.log('Success to establish connection with mongodb'.bgGreen); 
}).catch(function (err) { 
  console.log('Failed to establish connection with mongodb'.bgRed);
  console.log(err.message); 
});

mongoose.Promise = global.Promise;
const db = mongoose.connection

module.exports = db;  
// conecction.js