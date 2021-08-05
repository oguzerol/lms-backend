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
    const userId = socket.handshake.auth.userId;
    socket.join(userId);
    // Call onDisconnect.
    socket.on("disconnect", () => {
      onDisconnect(socket);
    });

    // Call onConnect.
    onConnect(socket);
  });
}
