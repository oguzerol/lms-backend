import to from "await-to-js";
import moment from "moment";

import UserExam from "../../../models/user_exam";
import { emitExamStart } from "../../../events/exam";
import {
  getUserAllExams,
  checkUserHasExam,
  getUserExam,
  getUserExams,
  startUserExam,
  endUserExam,
} from "./exams.services";

// TODO: Create service layer
// TODO: Handle errors via try catch in just controller

export async function exams(req, res) {
  const user_id = req.user.id;
  const { type } = req.query;

  const [err, exams] = await to(getUserAllExams(user_id, type));
  if (err) {
    return res.status(503).json({
      status: false,
      message: "Sınavlar getirilirken bir hata oluştu.",
      stack: err.message,
    });
  }

  res.json(exams);
}

export async function exam(req, res) {
  const { id: exam_id } = req.params;
  const user_id = req.user.id;
  if (isNaN(exam_id)) {
    return res.status(409).json({
      status: false,
      message: "Sınav numarası hatalı",
    });
  }

  // Check if user has exam
  const [examExistErr, examExist] = await to(
    checkUserHasExam(user_id, exam_id)
  );

  if (examExistErr) {
    return res.status(503).json({
      status: false,
      message: "Bir hata oluştu.",
      stack: examExistErr.message,
    });
  }

  if (!examExist) {
    return res.status(409).json({
      status: false,
      message: "Böyle bir sınav yok.",
    });
  }

  const [err, exam] = await to(getUserExam(user_id, exam_id));

  if (err) {
    return res.status(503).json({
      status: false,
      message: "Sınavlar getirilirken bir hata oluştu.",
      stack: err.message,
    });
  }

  emitExamStart(req.io, user_id, exam_id);
  res.json(exam);
}

export async function startExam(req, res) {
  const { id: exam_id } = req.params;
  const user_id = req.user.id;

  // check exam id is given
  if (![exam_id].every(Boolean)) {
    return res.json("Exam id yok");
  }

  // Check if user has exam
  const [examExistErr, examExist] = await to(
    checkUserHasExam(user_id, exam_id)
  );

  if (examExistErr) {
    return res.status(503).json({
      status: false,
      message: "Bir hata oluştu.",
      stack: examExistErr.message,
    });
  }

  if (!examExist) {
    return res.status(409).json({
      status: false,
      message: "Bu sınav yok veya bu sınava sahip değilsiniz.",
    });
  }

  // check user has already active exam
  const [userExamsErr, userExams] = await to(getUserExams(user_id));
  if (userExamsErr) {
    return res.status(503).json({
      status: false,
      message: "Bir hata oluştu.",
      stack: examExistErr.message,
    });
  }

  // TODO: via db
  const activeExam = userExams.filter(
    (exam) => exam.standalone_start_time && exam.standalone_status !== 2
  );

  if (activeExam.length > 0) {
    if (activeExam[0].exam_id === parseFloat(exam_id)) {
      return exam(req, res);
    } else {
      return res.status(409).json({
        status: false,
        error: `Şu anda çözdüğünüz bir sınav var. ${activeExam[0].exam_id}`,
      });
    }
  }

  // // check standalone usage
  // if (
  //   moment(moment().format()).isBefore(moment(examExist.standalone_usage_time))
  // ) {
  //   return res.status(409).json({
  //     status: false,
  //     error: `Bu sınav ${moment(exam.standalone_usage_time).format(
  //       "MMMM DD YYYY - HH:mm"
  //     )} tarihinden sonra tek başına çözülebilir.`,
  //   });
  // }

  // check is already finished or started
  const isExamFinished =
    examExist.standalone_status === 2 ||
    (examExist.standalone_end_time !== null &&
      moment(moment().format()).isAfter(moment(examExist.standalone_end_time)));

  if (isExamFinished) {
    return res.status(409).json({
      status: false,
      error: `Bu sınavı daha önce bitirdiniz.`,
    });
  }

  // Update exam status and times

  // status
  // null is not started
  // 1 is active
  // 2 is finished

  const updatedExam = await startUserExam(user_id, exam_id);

  console.log("teeeest", updatedExam);

  return exam(req, res);
}

export async function endExam(req, res) {
  const { id: exam_id } = req.params;
  const user_id = req.user.id;

  // check exam id is given
  if (![exam_id].every(Boolean)) {
    return res.json("Exam id yok");
  }

  // Check if user has exam
  const [examExistErr, examExist] = await to(
    checkUserHasExam(user_id, exam_id)
  );

  if (examExistErr) {
    return res.status(503).json({
      status: false,
      message: "Bir hata oluştu.",
      stack: examExistErr.message,
    });
  }

  if (!examExist) {
    return res.status(409).json({
      status: false,
      message: "Böyle bir sınav yok.",
    });
  }

  const updatedExam = await endUserExam(user_id, exam_id);

  return res.json({
    status: true,
    exam: { id: exam_id },
  });
}
