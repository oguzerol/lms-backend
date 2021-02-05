import to from "await-to-js";
import tablaNames from "../../../constants/tableNames";

import User from "../../../models/user";
import Exam from "../../../models/exam";

export async function exams(req, res) {
  const user_id = req.user.id;

  const [err, exams] = await to(
    User.relatedQuery(tablaNames.exams).for(user_id)
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

export async function exam(req, res) {
  const { id: exam_id } = req.params;
  const user_id = req.user.id;
  if (![exam_id].every(Boolean)) {
    return res.status(409).json({
      status: false,
      message: "Sınavlar bilgisi gerekli",
    });
  }

  const [err, exam] = await to(
    User.relatedQuery(tablaNames.exams)
      .for(user_id)
      .where({ exam_id })
      .select("name", "description")
      .first()
      .withGraphFetched({
        questions: {
          answers: true,
        },
      })
    // '[pets(selectName, onlyDogs), children(orderByAge).[pets, children]]'
  );

  console.log(exam.id);

  if (err) {
    return res.status(503).json({
      status: false,
      message: "Sınavlar getirilirken bir hata oluştu.",
      stack: err.message,
    });
  }

  res.json(exam);
}
