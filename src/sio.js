const sio = require("socket.io");

let io = null;
module.exports = {
  //Initialize the socket server
  initialize: function (httpServer) {
    io = sio(httpServer, {
      cors: {
        origin: "http://localhost:3000",
      },
    });
  },
  //return the io instance
  getInstance: function () {
    return io;
  },
};
