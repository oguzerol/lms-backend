import { EventEmitter } from "events";

const timers = {};

const examEvents = new EventEmitter();

function onExamStart(user_id, exam_id) {
  timers[user_id] = setTimeout(() => {
    onExamEnd(user_id, exam_id);
  }, 3000);
  // console.log("start timers", timers);
}

function onExamEnd(user_id, exam_id) {
  console.log("sinav sona erdi", user_id, exam_id);
  // TODO: Update db
  // TODO: send socket message to close user screen
  clearTimeout(timers[user_id]);
  console.log("end timers", timers[user_id]);
  delete timers[user_id];
}

// export function emitExamEnd(user_id, exam_id) {
//   examEvents.emit("examEnd", user_id, exam_id);
// }

export function emitExamStart(user_id, exam_id) {
  examEvents.emit("examStart", user_id, exam_id);
}

export function registerEvents() {
  // Register listeners
  examEvents.on("examStart", (user_id, exam_id) =>
    onExamStart(user_id, exam_id)
  );
  // examEvents.on("examEnd", (user_id, exam_id) => onExamEnd(user_id, exam_id));
}
