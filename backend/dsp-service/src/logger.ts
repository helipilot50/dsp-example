import { createLogger, format, transports } from 'winston';
export { Logger } from 'winston';
export const logger = createLogger({
  // levels: {
  //   error: 0,
  //   warning: 1,
  //   info: 2,
  //   debug: 3,
  //   trace: 4
  // },
  level: 'debug',
  format: format.combine(
    // format.splat(),
    // format.simple()
    format.prettyPrint()
  ),
  transports: [new transports.Console()]
});
