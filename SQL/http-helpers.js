var path = require('path');
var querystring = require('querystring');
var db = require('./db').dbConnection;
// var dbh = require('./db-helpers');


var headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
};

var sendResponse = function(res, data, statusCode, ctype) {
  statusCode = statusCode || 200;
  headers['Content-Type'] = ctype || "application/json";
  res.writeHead(statusCode, headers);
  res.end(JSON.stringify(data));
};

var collectData = function(req, callback) {
  var data = '';
  req.addListener('data', function(chunk) {
    data += chunk;
  });
  req.addListener('end', function() {
    callback(null, JSON.parse(data));
  });
};

var send404 = function(req, res) {
  sendResponse(res, 'Not Found', 404);
};

var sendOptionsResponse = function(req, res) {
  sendResponse(res, null);
};

var sendMessages = function(res, rows, statusCode) {
  var messages = [];
  for (var i=0; i < rows.length; i++) {
    messages.push({username: rows[i].username, text: rows[i].text});
  }
  // console.log(messages);
  sendResponse(res, {results: messages}, statusCode);
};

var messages = [];
var chatMessages = function(req, res) {
  if (req.method === 'POST') {
    collectData(req, function(err, data) {
      var message = data;
      messages.push(message);
      db.query("INSERT INTO messages SET ?", message, function(err) {
        if (err) throw err;
        db.query("SELECT * FROM messages", function(err, messages) {
          if (err) throw err;
          sendResponse(res, {results: messages}, 201);
        });
      });
    });
  } else {
    // console.log(messages);
    db.query("SELECT * FROM messages", function(err, messages) {
      if (err) throw err;
      sendResponse(res, {results: messages});
    });
  }
};

exports.send404 = send404;
exports.sendOptionsResponse = sendOptionsResponse;
exports.chatMessages = chatMessages;
