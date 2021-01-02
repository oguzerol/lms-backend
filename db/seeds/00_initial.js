const Knex = require("knex");
const bcrypt = require("bcrypt");
const tableNames = require("../../src/constants/tableNames");

/**
 * @param {Knex} knex
 */
exports.seed = async (knex) => {
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
};
