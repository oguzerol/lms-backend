import { Model } from "objection";

import tableNames from "../constants/tableNames";

export default class Exam extends Model {
  static get tableName() {
    return tableNames.exams;
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: [
        "name",
        "description",
        "price",
        "standalone_usage_time",
        "question_count",
        "start_time",
        "end_time",
      ],
      properties: {
        id: { type: "integer" },
        name: { type: "string" },
        description: { type: "string" },
        price: { type: "decimal" },
        question_count: { type: "integer" },
        standalone_usage_time: { type: "timestamp", default: new Date() },
        start_time: { type: "timestamp" },
        end_time: { type: "timestamp" },
        created_at: { type: "timestamp" },
        updated_at: { type: "timestamp" },
        deleted_at: { type: ["timestamp", "null"] },
      },
    };
  }

  static get relationMappings() {
    const Question = require("./question").default;
    const UserExam = require("./user_exam").default;

    return {
      questions: {
        relation: Model.HasManyRelation,
        modelClass: Question,
        join: {
          from: `${tableNames.exams}.id`,
          to: `${tableNames.questions}.exam_id`,
        },
      },
      user_exams: {
        relation: Model.BelongsToOneRelation,
        modelClass: UserExam,
        join: {
          from: `${tableNames.exams}.id`,
          to: `${tableNames.userExams}.exam_id`,
        },
      },
    };
  }
}
