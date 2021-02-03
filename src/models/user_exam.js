import { Model } from "objection";

import tableNames from "../constants/tableNames";

export default class Exam extends Model {
  static get tableName() {
    return tableNames.userExams;
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["exam_id", "user_id"],
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
}
