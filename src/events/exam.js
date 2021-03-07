import { EventEmitter } from "events";
import UserExam from "../models/user_exam";

const timers = {};

const examEvents = new EventEmitter();

function onExamStart(user_id, exam_id) {
  // console.log(timers[user_id]);
  timers[user_id] = setTimeout(() => {
    onExamEnd(user_id, exam_id);
  }, 3000);
  // console.log("start timers", timers);
}

async function onExamEnd(user_id, exam_id) {
  // console.log("sinav sona erdi", user_id, exam_id);
  // TODO: Update db
  // TODO: send socket message to close user screen
  // await UserExam.query()
  //   .where("user_id", user_id)
  //   .where("exam_id", exam_id)
  //   .patch({
  //     standalone_status: 2,
  //   });
  clearTimeout(timers[user_id]);
  // console.log("end timers", timers[user_id]);
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
