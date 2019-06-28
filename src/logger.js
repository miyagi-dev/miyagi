const { createLogger, format, transports } = require("winston");
const { combine, timestamp, printf } = format;
const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});
const logger = createLogger({
  transports: [new transports.Console()],
  format: combine(
    timestamp({
      format: "YYYY/MM/DD HH:mm:ss"
    }),
    logFormat
  )
});

module.exports = logger;
