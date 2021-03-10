import User from "../../../models/user";
import UserExam from "../../../models/user_exam";
import tableNames from "../../../constants/tableNames";
import moment from "moment";

export async function checkUserHasExam(user_id, exam_id) {
  return await UserExam.query()
    .where("user_id", user_id)
    .where("exam_id", exam_id)
    .first();
}

export async function getUserExams(user_id) {
  return await UserExam.query().where("user_id", user_id);
}

export async function getUserAllExams(user_id, type) {
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
  return await dbQuery;
}

export async function getUserExam(user_id, exam_id) {
  return await User.relatedQuery(tableNames.exams)
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
    });
}

export async function startUserExam(user_id, exam_id) {
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
  return await UserExam.query()
    .where("user_id", user_id)
    .where("exam_id", exam_id)
    .patch({
      standalone_status: 2,
    });
}
