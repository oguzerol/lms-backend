const io = require("socket.io")();

io.on("connection", (socket) => {
  const timers = {};

  socket.on("startExam", () => {
    if (typeof timers[socket.id] !== "undefined") {
      clearTimeout(timers[socket]);
    }

    timers[socket.id] = setTimeout(() => {
      socket.emit("Error", { error: { msg: "You took too long" } });
      socket.emit("AFK");
    }, 60000);
  });

  socket.on("endExam", () => {
    if (typeof timers[socket.id] !== "undefined") {
      clearTimeout(timers[socket.id]);
      delete timers[socket.id];
    }
  });
});
