import { Model } from "objection";

import tableNames from "../constants/tableNames";

export default class Exam extends Model {
  static get tableName() {
    return tableNames.userExams;
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: [],
      properties: {
        id: { type: "integer" },
        exam_id: { type: "integer" },
        user_id: { type: "integer" },
        standalone_start_time: { type: "timestamp" },
        standalone_end_time: { type: "timestamp" },
        standalone_status: { type: "integer" },
        created_at: { type: "timestamp" },
        updated_at: { type: "timestamp" },
        deleted_at: { type: ["timestamp", "null"] },
      },
    };
  }

  static get relationMappings() {
    const User = require("/user");
    const Exam = require("./exam");

    return {
      user: {
        relation: Model.ManyToManyRelation,
        modelClass: User,
        join: {
          from: `${tableNames.userExams}.exam_id`,
          to: `${tableNames.users}.id`,
        },
      },

      exam: {
        relation: Model.ManyToManyRelation,
        modelClass: Exam,
        join: {
          from: `${tableNames.userExams}.id`,
          to: `${tableNames.exams}.exam_id`,
        },
      },
    };
  }
}
