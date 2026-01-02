const request = require("supertest");
const { app } = require("../../app");
const { pool } = require("../../config/db");


describe("Health API", () => {
  it("should return UP", async () => {
    const res = await request(app).get("/api/v1/health");

    expect(res.statusCode).toBe(200);
    expect(res.headers["content-type"]).toMatch(/json/);
    expect(res.body).toHaveProperty("status");
    expect(res.body.status).toBe("UP");
  });
});

describe("Ready API", () => {
  it("should return READY", async () => {
    const res = await request(app).get("/api/v1/ready");

    expect(res.statusCode).toBe(200);
    expect(res.headers["content-type"]).toMatch(/json/);
    expect(res.body).toHaveProperty("status");
    expect(res.body.status).toBe("READY");
  });
});


