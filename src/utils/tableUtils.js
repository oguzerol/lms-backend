const addDefaultColumns = (knex, table) => {
  table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
  table.timestamp("updated_at").notNullable().defaultTo(knex.fn.now());
  table.timestamp("deleted_at");
};

const references = (table, tableName) => {
  table
    .integer(`${tableName.substring(0, tableName.length - 1)}_id`)
    .unsigned()
    .references("id")
    .inTable(tableName)
    .onDelete("cascade");
};

module.exports = {
  addDefaultColumns,
  references,
};
