const supertest = require("supertest");
const app = require("../../app");
const db = require("../../db");

describe("GET /api/v1/users", () => {
  it("should respond with an array of products", async () => {
    const response = await supertest(app)
      .get("/api/v1/users")
      .expect("Content-type", /json/)
      .expect(200);

    expect(response.body.length).toBeGreaterThan(0);
  });
  afterAll(async () => {
    await db.destroy();
  });
});
