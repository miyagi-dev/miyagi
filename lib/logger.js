"use strict";

const { createLogger, format, transports } = require("winston");
const { combine, timestamp, printf, colorize } = format;
const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});
const logger = createLogger({
  transports: [new transports.Console()],
  format: combine(
    colorize(),
    timestamp({
      format: "YYYY/MM/DD HH:mm:ss",
    }),
    logFormat
  ),
});

module.exports = logger;
