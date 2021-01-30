const Knex = require("knex");
const tableNames = require("../../src/constants/tableNames");
const { addDefaultColumns, references } = require("../../src/utils/tableUtils");

/**
 * @param {Knex} knex
 */

exports.up = async (knex) => {
  await Promise.all([
    knex.schema.createTable(tableNames.users, (table) => {
      table.increments().notNullable();
      table.string("email", 254).notNullable().unique();
      table.string("password", 127).notNullable();
      table.string("username").notNullable();
      table.string("name");
      table.string("surname");
      table.date("birth_date");
      table.string("city");
      table.string("town");
      table.string("grade");
      table.string("grade_class");
      table.boolean("is_student").defaultTo(true);
      table.string("phone");
      table.text("address");
      table.boolean("is_admin").defaultTo(false);
      table.boolean("is_super_admin").defaultTo(false);
      table.text("reset_link");
      table.timestamp("last_login");
      addDefaultColumns(knex, table);
    }),
    knex.schema.createTable(tableNames.exams, (table) => {
      table.increments().notNullable();
      table.string("name").notNullable().unique();
      table.string("description").notNullable();
      table.decimal("price", 10, 2).notNullable();
      table
        .timestamp("standalone_usage_time")
        .notNullable()
        .defaultTo(knex.fn.now());
      table.integer("question_count").notNullable();
      table.timestamp("start_time").notNullable();
      table.timestamp("end_time").notNullable();
      addDefaultColumns(knex, table);
    }),
  ]);

  await knex.schema.createTable(tableNames.userExams, (table) => {
    table.increments().notNullable();
    table.timestamp("standalone_start_time");
    table.timestamp("standalone_end_time");
    table.integer("standalone_status");
    table.json("exam").notNullable();
    table.json("answers").notNullable().defaultTo('{"data": []}');
    references(table, tableNames.exams);
    references(table, tableNames.users);
    addDefaultColumns(knex, table);
  });

  await knex.schema.createTable(tableNames.questions, (table) => {
    table.increments().notNullable();
    table.string("type").notNullable();
    table.text("info");
    table.text("content").notNullable();
    references(table, tableNames.exams);
    addDefaultColumns(knex, table);
  });

  await knex.schema.createTable(tableNames.answers, (table) => {
    table.increments().notNullable();
    table.string("label").notNullable();
    table.text("content"); // not nullable
    table.boolean("is_correct").notNullable();
    references(table, tableNames.exams);
    references(table, tableNames.questions);
    addDefaultColumns(knex, table);
  });
};

exports.down = async (knex) => {
  await Promise.all(
    [
      tableNames.answers,
      tableNames.questions,
      tableNames.userExams,
      tableNames.users,
      tableNames.exams,
    ].map((tableName) => knex.schema.dropTable(tableName))
  );
};
