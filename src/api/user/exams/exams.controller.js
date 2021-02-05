import to from "await-to-js";
import tableNames from "../../../constants/tableNames";

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
  if (isNaN(exam_id)) {
    return res.status(409).json({
      status: false,
      message: "Sınav numarası hatalı",
    });
  }

  // Check if exam is exist
  const [examExistErr, examExist] = await to(Exam.query().findById(exam_id));
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

  const [err, exam] = await to(
    User.relatedQuery(tableNames.exams)
      .for(user_id)
      .where({ exam_id })
      .select("name", "description")
      .first()
      .withGraphFetched(
        `${tableNames.questions}(questionFields).${tableNames.answers}(answerFields)`
      )
      .modifiers({
        questionFields: (builder) => {
          builder.select("id", "type", "info", "content");
        },

        answerFields: (builder) => {
          builder.select("id", "label", "content");
        },
      })
  );

  if (err) {
    return res.status(503).json({
      status: false,
      message: "Sınavlar getirilirken bir hata oluştu.",
      stack: err.message,
    });
  }

  res.json(exam);
}
