const express = require("express");
const { healthRoutes } = require('./routes/health.routes');
const { errorHandler } = require("./middlewares/errorhandler");
const { authRoute } = require("./routes/auth.routes");
const { orderRoute } = require("./routes/order.routes");
const { adminRoute } = require("./routes/admin.routes");
const { deliveryRoute } = require("./routes/delivery.route");

const app = express();
const BASE_API = `/api/v1`;

//middleware
app.use(express.json());
app.use(BASE_API,healthRoutes);
app.use(BASE_API+`/auth`, authRoute );
app.use(BASE_API, orderRoute );
app.use(BASE_API+`/admin`, adminRoute);
app.use(BASE_API+`/delivery`, deliveryRoute);


//ERROR HANDLING
app.use(errorHandler);

module.exports = { app };