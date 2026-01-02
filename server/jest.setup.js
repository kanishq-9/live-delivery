const { pool } = require("./config/db");

afterAll(() => {
  jest.clearAllMocks();
});


afterAll(async () => {
  await pool.end(); 
});