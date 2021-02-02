import to from "await-to-js";

import Exam from "../../models/exam";

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

  res.json(exams);
}
