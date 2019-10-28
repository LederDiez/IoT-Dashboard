'user strict'

const mongoose = require('mongoose');
const colors   = require('colors');

mongoose.set('useUnifiedTopology', true);
mongoose.connect('mongodb://localhost/express', {
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