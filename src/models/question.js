import { Model } from "objection";

import tableNames from "../constants/tableNames";

export default class Question extends Model {
  static get tableName() {
    return tableNames.questions;
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
    const Answer = require("./answer").default;
    const UserAnswer = require("./user_answer").default;

    return {
      user_answers: {
        relation: Model.BelongsToOneRelation,
        modelClass: UserAnswer,
        join: {
          from: `${tableNames.questions}.id`,
          to: `${tableNames.userAnswers}.question_id`,
        },
      },
      answers: {
        relation: Model.HasManyRelation,
        modelClass: Answer,
        join: {
          from: `${tableNames.questions}.id`,
          to: `${tableNames.answers}.question_id`,
        },
      },
    };
  }
}
