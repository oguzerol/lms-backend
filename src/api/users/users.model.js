import { Model } from "objection";

import tableNames from "../../constants/tableNames";

export default class User extends Model {
  static get tableName() {
    return tableNames.users;
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["email", "password", "username"],
      properties: {
        id: { type: "integer" },
        email: { type: "string" },
        password: { type: "string" },
        name: { type: "string" },
        surname: { type: "string" },
        username: { type: "string" },
        birthDate: { type: ["timestamp", "null"] },
        city: { type: ["string", "null"] },
        town: { type: ["string", "null"] },
        grade: { type: ["string", "null"] },
        grade_class: { type: ["string", "null"] },
        is_student: { type: "boolean", default: true },
        phone: { type: ["string", "null"] },
        address: { type: ["text", "null"] },
        is_admin: { type: "boolean", default: false },
        is_super_admin: { type: "boolean", default: false },
        resetToken: { type: ["reset_link", "null"] },
        last_login: { type: ["timestamp", "null"] },
        created_at: { type: "timestamp" },
        updated_at: { type: "timestamp" },
        deleted_at: { type: ["timestamp", "null"] },
      },
    };
  }
}
