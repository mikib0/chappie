const redis = require('redis');

const logFather = require('../logger');
const logger = logFather.child({ label: 'redis' });

const redisClient = redis.createClient({
  url: process.env.REDIS_URL,
});

(async () => {
  try {
    logger.info(`connecting to redis`);
    await redisClient.connect();
    logger.info(`connected to redis`);
  } catch (err) {
    logger.error(`error while connecting to redis`, err);
  }
})();


module.exports = redisClient