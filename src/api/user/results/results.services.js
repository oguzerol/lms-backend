import UserExam from "../../../models/user_exam";
import tableNames from "../../../constants/tableNames";

export async function checkUserHasExam(user_id, exam_id) {
  return await UserExam.query()
    .where("user_id", user_id)
    .where("exam_id", exam_id)
    .first();
}

export async function getUserExams(user_id, type) {
  let dbQuery = UserExam.query()
    .where("user_id", user_id)
    .select("standalone_status")
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
