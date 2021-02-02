const supertest = require("supertest");
const app = require("../../app");

describe("GET /api/v1/exams", () => {
  it("should respond with an array of exams", async () => {
    const response = await supertest(app)
      .get("/api/v1/exams")
      .expect("Content-type", /json/)
      .expect(200);

    expect(response.body).toEqual([]);
  });
});
