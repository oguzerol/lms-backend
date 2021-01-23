import { Model } from "objection";

import tableNames from "../../constants/tableNames";

class User extends Model {
  static get tableName() {
    return tableNames.users;
  }
}

export default User;
