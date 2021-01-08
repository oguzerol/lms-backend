const { Model } = require("objection");

const tableNames = require("../../constants/tableNames");

class User extends Model {
  static get tableName() {
    return tableNames.users;
  }
}

module.exports = User;
