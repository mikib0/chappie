// require('dotenv').config();
const {
  MAX_TOKENS,
  REQUESTS_LIMIT,
  TOKENS_LIMIT,
  IMAGE_LIMIT,
} = require('./constants');
const logFather = require('./logger');
const logger = logFather.child({ label: 'rate_limit' });

const { redis } = require('./db');

class LimitResetter {
  MIN_MS = 60 * 1000;
  endTime;
  waiters = []; // an array of promise resolve callbacks

  async startResetter() {
    logger.info('limit resetter starts');
    await this.resetter();
    setInterval(() => this.resetter(), this.MIN_MS);
  }

  async resetter() {
    const [imageRequests, textRequests, tokens] = await this.resetLimit();
    logger.info(
      `limit resets at imageRequests=${imageRequests} textRequests=${textRequests} tokens=${tokens}`
    );
    this.waiters.forEach((waiter) => waiter());
    this.waiters = [];
    this.endTime = Date.now() + this.MIN_MS + 200;
  }

  async resetLimit() {
    const apiKey =
      process.env.NODE_ENV == 'dev'
        ? process.env.OPENAI_API_TEST_KEY
        : process.env.OPENAI_API_KEY;
    return await redis
      .multi()
      .get(`${apiKey}_imageRequests`)
      .get(`${apiKey}_textRequests`)
      .get(`${apiKey}_tokens`)
      .set(`${apiKey}_imageRequests`, 0)
      .set(`${apiKey}_textRequests`, 0)
      .set(`${apiKey}_tokens`, 0)
      .exec();
  }

  delay() {
    const delayTime = this.endTime - Date.now();

    return {
      promise: new Promise((res, rej) => {
        this.waiters.push(res);
        // setTimeout(res, delayTime);
      }),
      time: delayTime,
    };
  }
}

const limitResetter = new LimitResetter();
/* TODO we want to wait for the limit to reset before the rest of the code starts to make request
  or you know what screw it! everything will settle since all the code the will use it
  is inside callback
*/

limitResetter.startResetter();

async function imageWait(logger) {
  logger = logger.child({ label: 'rate_limit' });
  const imageRequests = await redis.incrBy(
    `${process.env.OPENAI_API_KEY}_imageRequests`,
    1
  ); //TODO (error handling)

  if (imageRequests > IMAGE_LIMIT) {
    const { promise, time } = limitResetter.delay();
    logger.notice(`image limit hit at ${time}`);
    await promise;
  }
  return;
}

async function textWait(logger, maxTokens) {
  logger = logger.child({ label: 'rate_limit' });
  const [tokens, textRequests] = await redis
    .multi()
    .incrBy(`${process.env.OPENAI_API_KEY}_tokens`, maxTokens)
    .incrBy(`${process.env.OPENAI_API_KEY}_textRequests`, 1)
    .exec(); //TODO (error handling)

  if (tokens > TOKENS_LIMIT || textRequests > REQUESTS_LIMIT) {
    const { promise, time } = limitResetter.delay();
    logger.notice(
      `text limit hit at ${time} tokens=${tokens} requests=${textRequests}`
    );
    await promise;
  }
  return;
}

async function updateTokensUsage(maxTokens, tokens) {
  await redis.decrBy(
    `${process.env.OPENAI_API_KEY}_tokens`,
    maxTokens - tokens
  );
}

async function test() {
  await imageWait();
  console.log('openAI hw far');
  // await updateTokensUsage(125);
}

// test();

module.exports = {
  imageWait,
  textWait,
  updateTokensUsage,
};
