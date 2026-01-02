const http = require("http");
require("dotenv").config();
const {dbInit} = require('./config/db');
const { app } = require("./app");
const logger = require("./config/logger");
const { hostname } = require("os");

const HOST = process.env.HOST || "0.0.0.0"; //TODO change later
const PORT = process.env.PORT || 8080;

http.createServer(app);

const connectServer = async function () {
    //INITIALIZE DATABASE
    await dbInit();

    // LISTEN TO SERVER CONNECTION
  const server = app.listen(PORT, HOST, async() => {
    logger.info(`Server connected successfully. used PORT=${PORT}`)
    console.log(`Server connected successfully. used PORT=${PORT}`);

    //HEALTH CHECK
    if(process.env.NODE_ENV === "development"){
      try {
    const response = await fetch(`${process.env.PROTOCOL}://${HOST}:${PORT}/api/v1/health`);

    if (!response.ok) {
      logger.error(`HTTP ${response.status}`);
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    logger.info("Health API response:", data);
    console.log("Health API response:", data);

  } catch (err) {
    logger.info("Health check error:", err);
    console.error("Health check error:", err);
  }
    }
  });

  //ERROR HANDLING FOR SERVER CONNECTION
  server.on("Error", (error) => {
    console.error(".....Server failed to connect.....");
    if (error.code === "EADDRINUSE") {
      logger.error(`PORT ${PORT} ALready in use.`);
    } else {
      logger.error(error.message);
    }
    //exit from the system
    process.exit(1);
  });
};

//CONNECT SERVER
connectServer();
