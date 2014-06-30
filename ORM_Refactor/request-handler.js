var url = require('url');
var path = require('path');
var helpers = require('./http-helpers');

var routes = {
  '/classes/chatterbox': helpers.chatMessages,
  '/classes/messages': helpers.chatMessages,
  '/classes/room1': helpers.chatMessages
  // '/classes/room1': helpers.room
}

exports.handleRequest = function(req, res) {
  var urlPath = url.parse(req.url).pathname;
  var method = req.method;

  if (method === 'OPTIONS') {
    helpers.sendOptionsResponse(req, res);
  } else if (urlPath && routes[urlPath]) {
    routes[urlPath](req, res);
  } else {
    helpers.send404(req, res);
  }
};
