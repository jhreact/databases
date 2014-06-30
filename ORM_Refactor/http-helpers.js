var path = require('path');
var querystring = require('querystring');
var Sequelize = require("sequelize");
var sequelize = new Sequelize("chat", "root", "",
  {logging: false,
   define: {engine: 'MYISAM'}
  });


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
  res.end(data);
};

var collectData = function(req, callback) {
  var data = '';
  req.addListener('data', function(chunk) {
    data += chunk;
  });
  req.addListener('end', function() {
    data = querystring.parse(data);
    callback(null, data);
  });
};

var send404 = function(req, res) {
  sendResponse(res, 'Not Found', 404);
};

var sendOptionsResponse = function(req, res) {
  sendResponse(res, null);
};

var Message = sequelize.define('message', {
  username: Sequelize.STRING,
  text: Sequelize.STRING,
  roomname: Sequelize.STRING
});
Message.sync();

var sendMessages = function(res, rows, statusCode) {
  var messages = [];
  for (var i=0; i < rows.length; i++) {
    messages.push({username: rows[i].username, text: rows[i].text});
  }
  // console.log(messages);
  sendResponse(res, {results: messages}, statusCode);
};

var chatMessages = function(req, res) {
  if (req.method === 'POST') {
    collectData(req, function(err, data) {
      var message = {username: data.username, text: data.message};
      var newMessage = Message.create(message).success(function() {
        var messages = [];
        Message.findAll().success(function(msgs) {
          for (var i=0; i < msgs.length; i++) {
            messages.push(msgs[i]);
          }
          sendResponse(res, JSON.stringify({results: messages}));
        });
      });
    });
  } else {
    // console.log(messages);
    var messages = [];
    Message.findAll().success(function(msgs) {
      for (var i=0; i < msgs.length; i++) {
        messages.push(msgs[i]);
      }
      sendResponse(res, JSON.stringify({results: messages}));
    });
  }
};

exports.send404 = send404;
exports.sendOptionsResponse = sendOptionsResponse;
exports.chatMessages = chatMessages;
