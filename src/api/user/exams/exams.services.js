import UserExam from "../../../models/user_exam";

export async function getUserExam() {
  return await Office.query().patchAndFetchById(id, {
    isDeleted: true,
    deletedAt: moment().format("DD/MM/YYYY HH:mm"),
  });
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
