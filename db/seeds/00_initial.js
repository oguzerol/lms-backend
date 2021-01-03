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
  // await Promise.all(
  //   [
  //     tableNames.userExams,
  //     tableNames.answers,
  //     tableNames.questions,
  //     tableNames.exams,
  //     tableNames.users,
  //   ].map((tableName) => knex(tableName).del())
  // );
  // const salt = await bcrypt.genSalt(10);

  // const sa = {
  //   email: "oe@onlineydt.com",
  //   name: "Oguz",
  //   surname: "EROL",
  //   password: await bcrypt.hash("1", salt),
  //   is_super_admin: true,
  // };

  // await knex(tableNames.users).insert([sa]);

  var data = fs.readFileSync(process.cwd() + "/src/constants/exam_sample.xlsx");
  var workbook = XLSX.read(data, { type: "buffer" });
  const firstWorksheet = workbook.Sheets[workbook.SheetNames[0]];
  const excelData = XLSX.utils.sheet_to_json(firstWorksheet, { header: 1 });

  // insert exam
  // const exam = {
  //   name: "Sample Exam",
  //   description: "Sample Desc",
  //   price: 20.0,
  //   question_count: 80,
  //   start_time: new Date(),
  //   end_time: new Date(),
  //   standalone_usage_time: new Date(),
  // };

  // const id = await knex(tableNames.exams).insert([exam], "id");

  excelData.forEach(async (question) => {
    console.log(question);
  });

  console.log(excelData[0][answerOrders.answerOne]);
  console.log(excelData[0][answerOrders.answerTwo]);
  console.log(excelData[0][answerOrders.answerThree]);
  console.log(excelData[0][answerOrders.answerFour]);
  console.log(excelData[0][answerOrders.answerFive]);

  console.log("content", excelData[0][questionOrders.content]);
  console.log("type", excelData[0][questionOrders.type]);
  console.log("info", excelData[0][questionOrders.info]);
};
