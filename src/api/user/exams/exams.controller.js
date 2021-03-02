import to from "await-to-js";
import moment from "moment";
import tableNames from "../../../constants/tableNames";

import User from "../../../models/user";
import Exam from "../../../models/exam";
import UserExam from "../../../models/user_exam";

export async function exams(req, res) {
  const user_id = req.user.id;
  const { type } = req.query;

  let dbQuery = UserExam.query()
    .where("user_id", user_id)
    .select("")
    .withGraphJoined("exams as info");

  if (type === "undone") {
    dbQuery = UserExam.query()
      .where("user_id", user_id)
      .where("standalone_status", null)
      .select("")
      .withGraphJoined("exams as info");
  }
  if (type === "done") {
    dbQuery = UserExam.query()
      .where("user_id", user_id)
      .where("standalone_status", 2)
      .select("")
      .withGraphJoined("exams as info");
  }
  const [err, exams] = await to(dbQuery);

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
    UserExam.query().where("user_id", user_id).where("exam_id", exam_id).first()
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

  const [err, exam] = await to(
    User.relatedQuery(tableNames.exams)
      .for(user_id)
      .where({ exam_id })
      .select("name", "description")
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

export async function startExam(req, res) {
  const now = moment();
  const { id: exam_id } = req.params;
  const user_id = req.user.id;

  console.log(req.params);

  // check exam id is given
  if (![exam_id].every(Boolean)) {
    return res.json("Exam id yok");
  }

  // Check if user has the exam
  const [examExistErr, examExist] = await to(
    UserExam.query().where("user_id", user_id).where("exam_id", exam_id).first()
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
  const [examActiveErr, examActive] = await to(
    UserExam.query().where("user_id", user_id).where("exam_id", exam_id)
  );
  const activeExam = examActive.filter(
    (exam) =>
      exam.standalone_end_time &&
      !(now.isAfter(exam.standalone_end_time) || exam.standalone_status === 2)
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
  const isExamStarted = examExist.standalone_end_time !== null;
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

  if (isExamStarted) {
    return exam(req, res);
  }

  // Update exam status and times

  // status
  // null is not started
  // 1 is active
  // 2 is finished

  const updatedExam = await UserExam.query()
    .where("user_id", user_id)
    .where("exam_id", exam_id)
    .patch({
      standalone_start_time: moment().format(),
      standalone_end_time: moment().add(3, "hours").format(),
      standalone_status: 1,
    });

  return exam(req, res);
}
