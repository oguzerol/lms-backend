const Knex = require("knex");
const bcrypt = require("bcrypt");
const tableNames = require("../../src/constants/tableNames");
const answerLabels = require("../../src/constants/answerLabels");
const {
  answerOrders,
  questionOrders,
} = require("../../src/constants/excelOrders");
const XLSX = require("xlsx");
var fs = require("fs");

/**
 * @param {Knex} knex
 */
exports.seed = async (knex) => {
  // insert admin
  await Promise.all(
    [
      tableNames.userExams,
      tableNames.answers,
      tableNames.questions,
      tableNames.exams,
      tableNames.users,
    ].map((tableName) => knex(tableName).del())
  );
  const salt = await bcrypt.genSalt(10);

  const sa = {
    email: "oe@onlineydt.com",
    name: "Oguz",
    surname: "EROL",
    password: await bcrypt.hash("1", salt),
    is_super_admin: true,
  };

  await knex(tableNames.users).insert([sa]);

  var data = fs.readFileSync(process.cwd() + "/src/constants/exam_sample.xlsx");
  var workbook = XLSX.read(data, { type: "buffer" });
  const firstWorksheet = workbook.Sheets[workbook.SheetNames[0]];
  const excelData = XLSX.utils.sheet_to_json(firstWorksheet, { header: 1 });

  // insert exam
  const exam = {
    name: "Sample Exam",
    description: "Sample Desc",
    price: 20.0,
    question_count: 80,
    start_time: new Date(),
    end_time: new Date(),
    standalone_usage_time: new Date(),
  };

  const examId = await knex(tableNames.exams).insert([exam], "id");

  for (const question of excelData) {
    const newQuestion = {
      exam_id: examId[0],
      type: question[questionOrders.type],
      info: question[questionOrders.info],
      content: question[questionOrders.content],
    };

    const questionId = await knex(tableNames.questions).insert(
      newQuestion,
      "id"
    );

    for (const label of answerLabels) {
      const newAnswer = {
        label,
        question_id: questionId[0],
        content: question[answerOrders[label]],
        is_correct: question[answerOrders.is_correct] === label,
      };
      await knex(tableNames.answers).insert([newAnswer]);
    }
  }
};
