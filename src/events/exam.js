import { EventEmitter } from "events";
const timers = {};

const examEvents = new EventEmitter();

function onExamStart(user_id, exam_id) {
  console.log("sinav basladi", user_id, exam_id);

  timers[user_id] = setTimeout(() => {
    console.log("sinav bitti");
    // Send message via io
  }, 2000);

  // if (typeof timers[socket.id] !== "undefined") {
  //   clearTimeout(timers[socket.id]);
  // }

  // console.log("yeee", data);
  // timers[user_id] = setTimeout(() => {
  //   console.log("sinav bitti");
  //   io.to(user_id).emit("end-exam");
  // }, 2000);
}

export function emitExamStart(user_id, exam_id) {
  examEvents.emit("examStart", user_id, exam_id);
}

export function registerEvents() {
  // Register listeners
  examEvents.on("examStart", (user_id, exam_id) =>
    onExamStart(user_id, exam_id)
  );
}
