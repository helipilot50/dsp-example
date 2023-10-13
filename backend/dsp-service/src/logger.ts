import { createLogger, format, transports } from 'winston';
export const logger = createLogger({
  level: 'info',
  format: format.combine(
    // format.splat(),
    // format.simple()
    format.prettyPrint()
  ),
  transports: [new transports.Console()]
});
