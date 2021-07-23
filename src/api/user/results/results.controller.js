import to from "await-to-js";
import { checkUserHasExam } from "../exams/exams.services";

import { getUserResult, getUserResults } from "./results.services";

export async function results(req, res) {
  const user_id = req.user.id;
  const { type } = req.query;

  const [err, exams] = await to(getUserResults(user_id, type));
  if (err) {
    return res.status(503).json({
      status: false,
      message: "Sınavlar getirilirken bir hata oluştu.",
      stack: err.message,
    });
  }

  res.json(exams);
}

export async function result(req, res) {
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
    examExist.standalone_status === 1 ||
    examExist.standalone_status === null
  ) {
    return res.status(409).json({
      status: false,
      message: "Bu sınavı erişim hakkınız yok.",
    });
  }

  const [err, exam] = await to(getUserResult(user_id, exam_id));

  if (err) {
    return res.status(503).json({
      status: false,
      message: "Sınav getirilirken bir hata oluştu.",
      stack: err.message,
    });
  }

  res.json(exam);
}
