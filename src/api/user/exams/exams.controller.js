import to from "await-to-js";

import User from "../../../models/user";

export async function exams(_, res) {
  const [err, exams] = await to(User.relatedQuery("exams").for(1));
  console.log(exams);

  if (err) {
    return res.status(503).json({
      status: false,
      message: "Sınavlar getirilirken bir hata oluştu.",
      stack: err.message,
    });
  }

  res.json(exams);
}
