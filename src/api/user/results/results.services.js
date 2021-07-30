import UserExam from "../../../models/user_exam";
import tableNames from "../../../constants/tableNames";

export async function getUserResults(user_id, type) {
  return UserExam.query()
    .where("user_id", user_id)
    .where("standalone_status", 2)
    .select("")
    .withGraphJoined("exams as info");
}

export async function getUserResult(user_id, exam_id) {
  return await UserExam.query()
    .for(user_id)
    .where({ exam_id: exam_id })
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
        builder.where({ user_id: user_id });
        builder.select("answer_id");
      },
      questionFields: (builder) => {
        builder.orderBy("id");
        builder.select("id", "type", "info", "content");
      },
      answerFields: (builder) => {
        builder.select("id", "label", "content", "is_correct");
      },
    })
    .first();
}
