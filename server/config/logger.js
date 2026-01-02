const { createLogger, format, transports } = require('winston');
require('winston-daily-rotate-file');
const path = require('path');

const { combine, timestamp, printf, errors, json } = format;

const consoleFormat = printf(({ level, message, timestamp, stack })=>{
    return `${timestamp} [${level}] : ${ stack || message }`;
});

const logger = createLogger({
    level : 'info',
    format : combine(
        timestamp({ format : 'YYYY-MM-DD HH:mm"ss'}),
        //to capture stack traces
        errors({ stack : true }),
        //Storing logs in json
        json()
    ),
    transports : [
        //Daily rotate for errors only
        new transports.DailyRotateFile(
            {
                filename : path.join(__dirname, "..", "logs", `error-%DATE%.log`),
                datePattern : 'YYYY-MM-DD',
                level : 'error',
                //Compress old logs to save space
                zippedArchive : true,
                //Rotate if file reaches 20MB
                maxSize : '20m',
                //Keep files for 30 days
                maxFiles : '30d'
            }
        ),

        //Daily rotate for all logs(combined)
        new transports.DailyRotateFile(
            {
                filename : path.join(__dirname, "..", "logs",`combined-%DATE%.log`),
                datePattern : 'YYYY-MM-DD',
                zippedArchive : true,
                maxSize : '20m',
                maxFiles : '15d'
            }
        )
    ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console({
    format: combine(
      format.colorize(),
      consoleFormat
    )
  }));
}

module.exports = logger;