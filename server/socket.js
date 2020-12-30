var socket = require('socket.io');

exports.io = null;

exports.init = function (server) {
  this.io = socket(server);

  this.io.on('connection', function (socket) {
    console.log('connected to ', socket.id);
  })
}

exports.emit_status = function (status) {
  this.io.emit('status', status);
}

