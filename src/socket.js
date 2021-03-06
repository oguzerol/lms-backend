const socket = require("socket.io");

let io = null;
export const timers = {};

module.exports = {
  //Initialize the socket server
  initialize: function (httpServer) {
    io = socket(httpServer, {
      cors: {
        origin: "http://localhost:3000",
      },
    });

    io.on("connection", async (socket) => {
      const user_id = socket.handshake.auth.userId;
      console.log(user_id, "socket connection");
      socket.join(user_id);

      // should clear time out
    });
  },

  //return the io instance
  getInstance: function () {
    return io;
  },
};
