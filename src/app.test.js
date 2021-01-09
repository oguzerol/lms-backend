const supertest = require("supertest");

const app = require("./app");

describe("App", () => {
  it("should respond with a message", async () => {
    const response = await supertest(app)
      .get("/")
      .expect("Content-Type", /json/)
      .expect(200);

    expect(response.body.message).toEqual("Hello from onlineydt.com");
  });
});
