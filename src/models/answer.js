import { Model } from "objection";

import tableNames from "../../constants/tableNames";

export default class Answer extends Model {
  static get tableName() {
    return tableNames.answers;
  }
}
