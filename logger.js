const { createLogger, format, config, transports } = require('winston');
const {
  combine,
  timestamp,
  printf,
  label,
  uncolorize,
  colorize,
  simple,
  errors,
} = format;
const uuid = require('uuid');

const myFormat = printf(
  ({ id, timestamp, label, level, message, ...meta }) => {
    // return `[${id}] [${timestamp}] [${label}] [${level}]: ${message} ${Object.entries(meta).map(kv=>kv.join('=')).join(' ')}`
    return `[${id}] [${timestamp}] [${label}] [${level}]: ${message} ${JSON.stringify(meta)}`;
  }
);

const logger = createLogger({
  level: 'debug',
  levels: config.syslog.levels,
  format: combine(
    colorize({ all: true }),
    timestamp(),
    errors({ stack: true }),
    myFormat
    // metadata({ }),
    // label({ label: 'purchase' }),
  ),
  transports: [
    new transports.Console({ handleExceptions: true, handleRejections: true }),
  ],
  exitOnError: false,
});

// new Promise((res, rej) => rej('heck off!'));

// g;

// logger.error({
//   id: uuid.v4(),
//   label: 'purchase',
//   message: new Error('oh no!'),
// });

// const child1 = logger.child({ label: 'gen-img' });
// child1.info('hello', { id: uuid.v4() });

// // profiling
// logger.profile('test');

// setTimeout(function () {

//   logger.profile('test');
// }, 1000);

//  const profiler = logger.startTimer();
//  setTimeout(function () {
//    profiler.done({ id: uuid.v4(), message: 'response time' });
//  }, 1000);

module.exports = logger

