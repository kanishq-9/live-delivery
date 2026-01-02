const express = require("express");
const { healthRoutes } = require('./routes/health.routes');
const { errorHandler } = require("./middlewares/errorhandler");
const { authRoute } = require("./routes/auth.routes");

const app = express();
const BASE_API = `/api/v1`;

//middleware
app.use(express.json());
app.use(BASE_API,healthRoutes);
app.use(BASE_API+`/auth`, authRoute );


//ERROR HANDLING
app.use(errorHandler);

module.exports = { app };