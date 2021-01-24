import { Model } from "objection";

import tableNames from "../../constants/tableNames";

export default class User extends Model {
  static get tableName() {
    return tableNames.users;
  }
}
