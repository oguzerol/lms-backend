import { EventEmitter } from "events";
import { endUserExam } from "../api/user/exams/exams.services";

// TODO: Read and populate from db
const timers = {};

const examEvents = new EventEmitter();

function onExamStart(socketio, user_id, exam_id) {
  console.log("sinav basladi 15 saniye sonra bitmesi lazim", user_id);

  timers[user_id] = setTimeout(() => {
    onExamEnd(socketio, user_id, exam_id);
  }, 3 * 1000 * 60 * 60);
}

async function onExamEnd(socketio, user_id, exam_id) {
  socketio.to(user_id).sockets.emit("end-exam");
  await endUserExam(user_id, exam_id);
  clearTimeout(timers[user_id]);
  delete timers[user_id];
}

// export function emitExamEnd(user_id, exam_id) {
//   examEvents.emit("examEnd", user_id, exam_id);
// }

export function emitExamStart(socketio, user_id, exam_id) {
  examEvents.emit("examStart", socketio, user_id, exam_id);
}

export function registerEvents() {
  // Register listeners
  examEvents.on("examStart", (socketio, user_id, exam_id) =>
    onExamStart(socketio, user_id, exam_id)
  );
}
