import to from "await-to-js";

import Exam from "../../models/exam";
import User from "../../models/user";
import tablaNames from "../../constants/tableNames";

export async function exams(_, res) {
  const [err, exams] = await to(
    Exam.query().select("name", "description", "price")
  );

  if (err) {
    return res.status(503).json({
      status: false,
      message: "Sınavlar getirilirken bir hata oluştu.",
      stack: err.message,
    });
  }

  return res.json(exams);
}

export async function enroll(req, res) {
  const { id } = req.params;
  const user_id = req.user.id;
  if (![id].every(Boolean)) {
    return res.json("Missing props");
  }

  // Check if exam is exist
  const [examErr, exam] = await to(
    Exam.query().findById(id).select("name", "description", "price")
  );
  if (examErr) {
    return res.status(503).json({
      status: false,
      message: "Bir hata oluştu.",
      stack: examErr.message,
    });
  }

  if (!exam) {
    return res.status(409).json({
      status: false,
      message: "Böyle bir sınav yok.",
    });
  }

  // Check is already purchased

  const [purchasedExamErr, purchasedExam] = await to(
    User.relatedQuery(tablaNames.exams)
      .for(user_id)
      .where("exam_id", id)
      .first()
  );

  if (purchasedExamErr) {
    return res.status(503).json({
      status: false,
      message: "Bir hata oluştu.",
      stack: purchasedExamErr.message,
    });
  }

  if (purchasedExam) {
    return res.status(409).json({
      status: false,
      message: "Böyle sınavı daha önce satın aldınız.",
    });
  }

  try {
    await User.relatedQuery(tablaNames.exams).for(user_id).relate(id);
  } catch (err) {
    return res.status(409).json({
      status: false,
      message: "Satın alma sırasında bir sorun oluştu.",
    });
  }

  return res.json(exam);
}
