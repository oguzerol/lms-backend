import { Model } from "objection";

import tableNames from "../../constants/tableNames";

export default class Question extends Model {
  static get tableName() {
    return tableNames.answers;
  }
}
