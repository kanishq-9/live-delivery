const request = require("supertest");
const { app } = require("../../app");
const { pool } = require("../../config/db");

describe("Login user API", ()=>{
    const email = "Test@Test.com";
    const ALLOWED_ROLES = ['USER', 'ADMIN', 'DELIVERY'];
    afterEach(async () => {
    await pool.query(`DELETE FROM users WHERE email = $1`, [
      email.trim().toLowerCase(),
    ]);
  });

  it("Should login new user successfully", async () => {
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

    //Logintest
    const loginRes = await request(app).post("/api/v1/auth/login").send({
      email: "Test@Test.com",
      password: "1234Test@"
    });
    expect(loginRes.statusCode).toBe(200);
    expect(loginRes.headers["content-type"]).toMatch(/json/);
    expect(loginRes.body).toHaveProperty("token");
    expect(loginRes.body.token).toEqual(expect.any(String));
    expect(loginRes.body).toHaveProperty("user");
    expect(loginRes.body.user).toHaveProperty("id");
    expect(loginRes.body.user.id).toEqual(expect.any(String));
    expect(loginRes.body.user).toHaveProperty("email");
    expect(loginRes.body.user.email).toEqual("test@test.com");
    expect(loginRes.body.user).toHaveProperty("role");
    expect(ALLOWED_ROLES).toContain(loginRes.body.user.role);
  });
}

)