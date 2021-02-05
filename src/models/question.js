import { Model } from "objection";

import tableNames from "../constants/tableNames;

export default class Question extends Model {
  static get tableName() {
    return tableNames.answers;
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["type", "info", "content"],
      properties: {
        id: { type: "integer" },
        type: { type: "string" },
        info: { type: "string" },
        content: { type: "string" },
        exam_id: { type: "integer" },
        created_at: { type: "timestamp" },
        updated_at: { type: "timestamp" },
        deleted_at: { type: ["timestamp", "null"] },
      },
    };
  }

  static get relationMappings() {
    const Exam = require("./exam");

    return {
      exam: {
        relation: Model.BelongsToOneRelation,
        modelClass: Exam,
        join: {
          from: `${tableNames.questions}.exam_id`,
          to: `${tableNames.exams}.id`,
        },
      },
    };
  }
}
