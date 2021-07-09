import to from "await-to-js";
import moment from "moment";

import { emitExamStart } from "../../../events/exam";
import {
  checkUserHasExam,
  getUserExam,
  getUserExams,
  startUserExam,
  endUserExam,
  isAlreadyAnswered,
  updateAnswer,
  insertAnswer,
  deleteAnswer,
} from "./exams.services";

// TODO: Create service layer
// TODO: Handle errors via try catch in just controller

export async function exams(req, res) {
  const user_id = req.user.id;
  const { type } = req.query;

  const [err, exams] = await to(getUserExams(user_id, type));
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
      message: "Bu sınavı erişim hakkınız yok.",
    });
  }

  if (
    examExist.standalone_status === 2 ||
    examExist.standalone_status === null
  ) {
    return res.status(409).json({
      status: false,
      message: "Bu sınavı erişim hakkınız yok.",
    });
  }

  const [err, exam] = await to(getUserExam(user_id, exam_id));

  if (err) {
    return res.status(503).json({
      status: false,
      message: "Sınav getirilirken bir hata oluştu.",
      stack: err.message,
    });
  }

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
  console.log(examExist);

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
  // 2 is finisheexamExist.standalone_status === 2d

  if (examExist.standalone_status === null) {
    emitExamStart(req.io, user_id, exam_id);
  }
  await startUserExam(user_id, exam_id);

  return res.json({ status: true });
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

export async function userAnswer(req, res) {
  const { exam_id, question_id, answer_id } = req.body;
  const user_id = req.user.id;

  // check exam id is given
  if (![question_id].every(Boolean) && ![exam_id].every(Boolean)) {
    return res.status(409).json({
      status: false,
      message: "Eksik parametre.",
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
      message: "Bu sınav yok veya bu sınava sahip değilsiniz.",
    });
  }

  if (examExist.standalone_status !== 1) {
    console.log(examExist);
    return res.status(409).json({
      status: false,
      message: "Bu sınava şuanda cevap veremezsiniz.",
    });
  }

  // TODO: check isvalid answer for question

  // Check if user has exam
  const [answeredQuestionErr, answeredQuestion] = await to(
    isAlreadyAnswered(user_id, question_id)
  );

  if (answeredQuestionErr) {
    return res.status(503).json({
      status: false,
      message: "Bir hata oluştu. 1",
      stack: answeredQuestionErr.message,
    });
  }

  if (answeredQuestion) {
    if (!answer_id) {
      const [deletedQuestionError, deletedQuestion] = await to(
        deleteAnswer(user_id, question_id)
      );

      if (deletedQuestionError) {
        return res.status(503).json({
          status: false,
          message: "Verilen cevap geri çekilirken bir hata oldu",
          stack: deletedQuestionError.message,
        });
      } else {
        return res.json({
          question_id: question_id,
          answer_id: null,
        });
      }
    }

    const [updatedQuestionError, updatedQuestion] = await to(
      updateAnswer(user_id, question_id, answer_id)
    );
    if (updatedQuestionError) {
      return res.status(503).json({
        status: false,
        message: "Verilen cevap güncellenirken bir hata oldu",
        stack: updatedQuestionError.message,
      });
    } else {
      return res.json({
        question_id: updatedQuestion.question_id,
        answer_id: updatedQuestion.answer_id,
      });
    }
  } else {
    const [insertedQuestionError, insertedQuestion] = await to(
      insertAnswer(user_id, question_id, answer_id)
    );
    if (insertedQuestionError) {
      return res.status(503).json({
        status: false,
        message: "Cevap verilirken bir hata oldu.",
        stack: insertedQuestionError.message,
      });
    } else {
      return res.json({
        question_id: insertedQuestion.question_id,
        answer_id: insertedQuestion.answer_id,
      });
    }
  }
}
