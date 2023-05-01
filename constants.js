const TOKENS_PER_IMAGE = 2000;
const MAX_TOKENS = 1000;
const REQUESTS_LIMIT = 3500;
const TOKENS_LIMIT = 90000;
const IMAGE_LIMIT = 50;
const REFERRAL_REWARD = 100;
const WAIT_TIME = 3000;
const DAILY_INCOMING = 200;
const TOKENS_IN_STOCK = (120 / 0.002) * 1000;

const plans = {
  starter: {
    price: '1.99',
    tokens: '20000',
    emoji: '🚀',
  },
  basic: {
    price: '2.99',
    tokens: 30000,
    emoji: '🎁',
  },
  lite: {
    price: '3.99',
    tokens: 40000,
    emoji: '💡',
  },
  standard: {
    price: '4.99',
    tokens: 50000,
    emoji: '🌟',
  },
  // deluxe: {
  //   price: '5.99',
  //   tokens: 60000,
  //   emoji: '🚀',
  // },
  ultimate: {
    price: '9.99',
    tokens: 100000,
    emoji: '💎',
  },
};

module.exports = {
  plans,
  TOKENS_PER_IMAGE,
  MAX_TOKENS,
  REQUESTS_LIMIT,
  TOKENS_LIMIT,
  IMAGE_LIMIT,
  REFERRAL_REWARD,
  WAIT_TIME,
  DAILY_INCOMING,
  TOKENS_IN_STOCK,
};
