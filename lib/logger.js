"use strict";

const { createLogger, format, transports } = require("winston");
const { combine, printf, colorize } = format;
const logFormat = printf(({ level, message }) => {
  return `${level}: ${message}`;
});
const logger = createLogger({
  transports: [new transports.Console()],
  format: combine(colorize(), logFormat),
});

module.exports = logger;
