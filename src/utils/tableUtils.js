const addDefaultColumns = (knex, table) => {
  table.datetime("created_at").notNullable().defaultTo(knex.fn.now());
  table.datetime("updated_at").notNullable().defaultTo(knex.fn.now());
  table.datetime("deleted_at");
};

const references = (table, tableName) => {
  table
    .integer(`${tableName}_id`)
    .unsigned()
    .references("id")
    .inTable(tableName)
    .onDelete("cascade");
};

module.exports = {
  addDefaultColumns,
  references,
};
