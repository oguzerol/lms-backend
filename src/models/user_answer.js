import { Model } from "objection";

import tableNames from "../constants/tableNames";

export default class UserAnswer extends Model {
  static get tableName() {
    return tableNames.userAnswers;
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["question_id", "answer_id"],
      properties: {
        id: { type: "integer" },
        question_id: { type: "integer" },
        answer_id: { type: "integer" },
        created_at: { type: "timestamp" },
        updated_at: { type: "timestamp" },
        deleted_at: { type: ["timestamp", "null"] },
      },
    };
  }
  static get relationMappings() {
    const Answers = require("./answer").default;
    const Question = require("./question").default;

    return {
      questions: {
        relation: Model.BelongsToOneRelation,
        modelClass: Question,
        join: {
          from: `${tableNames.userAnswers}.question_id`,
          to: `${tableNames.questions}.id`,
        },
      },
      answers: {
        relation: Model.BelongsToOneRelation,
        modelClass: Answers,
        join: {
          from: `${tableNames.userAnswers}.answers_id`,
          to: `${tableNames.answers}.id`,
        },
      },
    };
  }
}
