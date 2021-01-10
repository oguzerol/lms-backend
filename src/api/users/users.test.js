const supertest = require("supertest");
const app = require("../../app");
const db = require("../../db");

describe("GET /api/v1/users", () => {
  it("should respond with an array of products", async () => {
    const response = await supertest(app)
      .get("/api/v1/users")
      .expect("Content-type", /json/)
      .expect(200);

    expect(response.body[0].id).toEqual(1);
    afterAll(async (done) => {
      await db.destroy();
      done();
    });
  });
});
