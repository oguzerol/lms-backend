// const socket = require("socket.io");

// let io = null;
// export const timers = {};

// module.exports = {
//   //Initialize the socket server
//   initialize: function (httpServer) {
//     io = socket(httpServer, {
//       cors: {
//         origin: "http://localhost:3000",
//       },
//     });
//     app.use(function (req, res, next) {
//       req.io = socketio;
//       next();
//     });

//     io.on("connection", async (socket) => {
//       const user_id = socket.handshake.auth.userId;
//       console.log(user_id, "socket connection");
//       socket.join(user_id);

//       // should clear time out
//     });
//   },

//   //return the io instance
//   getInstance: function () {
//     return io;
//   },
// };

// When the user disconnects.. perform this
async function onDisconnect(socket) {
  console.log("disconnected");
}

// When the user connects.. perform this
async function onConnect(socket) {
  console.log("connected");
}

export default function (socketio, app) {
  app.use(function (req, res, next) {
    req.io = socketio;
    next();
  });

  socketio.on("connection", function (socket) {
    // Call onDisconnect.
    socket.on("disconnect", () => {
      onDisconnect(socket);
    });

    // Call onConnect.
    onConnect(socket);
  });
}
