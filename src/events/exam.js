import { EventEmitter } from "events";
import {
  endUserExam,
  getAllActiveExams,
} from "../api/user/exams/exams.services";

import moment from "moment";

const timers = {};

const examEvents = new EventEmitter();

async function onServerStart(socketio) {
  const activeExams = await getAllActiveExams();

  if (activeExams.length > 0) {
    activeExams.forEach((exam) => {
      const diff = moment
        .duration(moment(exam.standalone_end_time).diff(moment(new Date())))
        .as("milliseconds");
      timers[exam.user_id] = setTimeout(() => {
        onExamEnd(socketio, exam.user_id, exam.exam_id);
      }, diff);
    });
  }
}

function onExamStart(socketio, user_id, exam_id) {
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

export function emitExamStart(user_id, exam_id) {
  examEvents.emit("examStart", user_id, exam_id);
}

export function registerEvents(socketio) {
  examEvents.on("examStart", (user_id, exam_id) =>
    onExamStart(socketio, user_id, exam_id)
  );
  onServerStart(socketio);
}
