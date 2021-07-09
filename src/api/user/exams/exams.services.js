import UserExam from "../../../models/user_exam";
import tableNames from "../../../constants/tableNames";
import UserAnswer from "../../../models/user_answer";
import moment from "moment";

export async function isAlreadyAnswered(user_id, question_id) {
  return await UserAnswer.query()
    .where("user_id", user_id)
    .where("question_id", question_id)
    .first();
}

export async function deleteAnswer(user_id, question_id) {
  return await UserAnswer.query()
    .where("user_id", user_id)
    .where("question_id", question_id)
    .delete();
}

export async function updateAnswer(user_id, question_id, answer_id) {
  return await UserAnswer.query()
    .where("user_id", user_id)
    .where("question_id", question_id)
    .patch({
      answer_id,
    })
    .returning("*")
    .first();
}

export async function insertAnswer(user_id, question_id, answer_id) {
  return await UserAnswer.query()
    .insert({
      user_id,
      question_id,
      answer_id,
    })
    .returning("*")
    .first();
}

export async function checkUserHasExam(user_id, exam_id) {
  return await UserExam.query()
    .where("user_id", user_id)
    .where("exam_id", exam_id)
    .first();
}

export async function getUserExams(user_id, type) {
  let dbQuery = UserExam.query()
    .where("user_id", user_id)
    .select("")
    .withGraphJoined("exams as info");

  if (type === "undone") {
    dbQuery = UserExam.query()
      .where("user_id", user_id)
      .where("standalone_status", null)
      .orWhere("standalone_status", 1)
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
  return await dbQuery;
}

export async function getUserExam(user_id, exam_id) {
  return await UserExam.query()
    .for(user_id)
    .where({ id: exam_id })
    .select("id", "standalone_end_time")
    .withGraphFetched(
      `[
        ${tableNames.exams}(examFields) as exam.${tableNames.questions}(questionFields).${tableNames.answers}(answerFields),
        ]`
    )
    .withGraphFetched(
      `[
        ${tableNames.exams}(examFields) as exam.${tableNames.questions}(questionFields).${tableNames.userAnswers}(userAnswerFields) as user_answer,
        ]`
    )
    .modifiers({
      examFields: (builder) => {
        builder.select("");
      },
      userAnswerFields: (builder) => {
        builder.select("answer_id");
      },
      questionFields: (builder) => {
        builder.orderBy("id");
        builder.select("id", "type", "info", "content");
      },
      answerFields: (builder) => {
        builder.select("id", "label", "content");
      },
    })
    .first();
}

export async function startUserExam(user_id, exam_id) {
  console.log("start");

  return await UserExam.query()
    .where("user_id", user_id)
    .where("exam_id", exam_id)
    .patch({
      standalone_start_time: moment().format(),
      standalone_end_time: moment().add(3, "hours").format(),
      standalone_status: 1,
    });
}

export async function endUserExam(user_id, exam_id) {
  console.log("end");
  return await UserExam.query()
    .where("user_id", user_id)
    .where("exam_id", exam_id)
    .patch({
      standalone_status: 2,
    });
}
