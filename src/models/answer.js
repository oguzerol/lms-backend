import { Model } from "objection";

import tableNames from "../../constants/tableNames";

export default class Answer extends Model {
  static get tableName() {
    return tableNames.answers;
  }
  static get jsonSchema() {
    return {
      type: "object",
      required: ["label", "is_correct"],
      properties: {
        id: { type: "integer" },
        label: { type: "string" },
        content: { type: "string" },
        is_correct: { type: "boolean" }, // TODO : not nullable update seeded exam
        exam_id: { type: "integer" },
        question_id: { type: "integer" },
        created_at: { type: "timestamp" },
        updated_at: { type: "timestamp" },
        deleted_at: { type: ["timestamp", "null"] },
      },
    };
  }

  static get relationMappings() {
    const Exam = require("/exam");
    const Question = require("/question");

    return {
      exam: {
        relation: Model.BelongsToOneRelation,
        modelClass: Exam,
        join: {
          from: `${tableNames.answers}.answer_id`,
          to: `${tableNames.exams}.id`,
        },
      },
      question: {
        relation: Model.BelongsToOneRelation,
        modelClass: Question,
        join: {
          from: `${tableNames.answers}.answer_id`,
          to: `${tableNames.questions}.id`,
        },
      },
    };
  }
}
