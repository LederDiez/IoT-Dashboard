'user strict'

const mongoose = require('mongoose');
const colors   = require('colors');

//"mongodb+srv://LederDiez:159753852@cluster0-jcmxa.mongodb.net/test?retryWrites=true&w=majority"
mongoose.connect('mongodb://localhost:27017/test', {
    useUnifiedTopology: true,
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