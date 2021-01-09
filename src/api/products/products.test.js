const supertest = require("supertest");
const app = require("../../app");

describe("GET /api/v1/products", () => {
  it("should respond with an array of products", async () => {
    const response = await supertest(app)
      .get("/api/v1/products")
      .expect("Content-type", /json/)
      .expect(200);

    expect(response.body).toEqual([]);
  });
});
