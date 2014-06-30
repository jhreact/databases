var db = require('./db').dbConnection;

var getMessages = function(callback) {
  dbConnection.query('SELECT * FROM MESSAGES', callback);
};
var insertMessage = function(message, callback) {
  dbConnection.query('INSERT INTO messages SET ?', message, callback);
};
