const request = require("supertest");
const { app } = require("../../app");
const { pool } = require("../../config/db");

//Register User Check

describe("Register User API", () => {
  const email = "Test@test.com";
  afterEach(async () => {
    await pool.query(`DELETE FROM users WHERE email = $1`, [
      email.trim().toLowerCase(),
    ]);
  });

  it("Should register new user successfully", async () => {
    const res = await request(app).post("/api/v1/auth/register").send({
      email: "Test@Test.com",
      password: "1234Test@",
      name: "Test Data",
      role: "USER",
      phone: "1234567890",
    });
    expect(res.statusCode).toBe(201);
    expect(res.headers["content-type"]).toMatch(/json/);
    expect(res.body).toHaveProperty("status");
    expect(res.body.status).toBe("User Registered");
    expect(res.body).toHaveProperty("data");
    expect(res.body.data).toEqual({
      name: "Test Data",
      email: "test@test.com",
      phone: "+911234567890",
    });
  });

  //Register user even without role
  it("Should register new user successfully", async () => {
    const res = await request(app).post("/api/v1/auth/register").send({
      email: "Test@Test.com",
      password: "1234Test@",
      name: "Test Data",
      phone: "1234567890",
    });
    expect(res.statusCode).toBe(201);
    expect(res.headers["content-type"]).toMatch(/json/);
    expect(res.body).toHaveProperty("status");
    expect(res.body.status).toBe("User Registered");
    expect(res.body).toHaveProperty("data");
    expect(res.body.data).toEqual({
      name: "Test Data",
      email: "test@test.com",
      phone: "+911234567890",
    });
  });

  //Error Handling
  it("Should show missing field error", async () => {
    const res = await request(app).post("/api/v1/auth/register").send({
      email: "Test@Test.com",
      password: "1234Test@",
    });
    expect(res.statusCode).toBe(400);
    expect(res.headers["content-type"]).toMatch(/json/);
    expect(res.body).toHaveProperty("status");
    expect(res.body.status).toBe("error");
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toBe("Invalid Field, Try Entering Every Field");
  });

  it("Should show duplicate field error", async () => {
    await request(app).post("/api/v1/auth/register").send({
      email: "Test@Test.com",
      password: "1234Test@",
      name: "Test Data",
      phone: "1234567890",
    });

    const res = await request(app).post("/api/v1/auth/register").send({
      email: "Test@Test.com",
      password: "1234Test@",
      name: "Test Data",
      phone: "1234567890",
    });
    expect(res.statusCode).toBe(409);
    expect(res.headers["content-type"]).toMatch(/json/);
    expect(res.body).toHaveProperty("status");
    expect(res.body.status).toBe("error");
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toBe("User Exist");
  });
});
