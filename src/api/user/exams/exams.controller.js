import to from "await-to-js";
import tablaNames from "../../../constants/tableNames";

import User from "../../../models/user";

export async function exams(req, res) {
  const { id } = req.params;

  const [err, exams] = await to(User.relatedQuery(tablaNames.exams).for(id));

  if (err) {
    return res.status(503).json({
      status: false,
      message: "Sınavlar getirilirken bir hata oluştu.",
      stack: err.message,
    });
  }

  res.json(exams);
}
