const TelegramBot = require('node-telegram-bot-api');

let bot = null;

// init bot
if (process.env.NODE_ENV === 'dev') {
  bot = new TelegramBot(
      process.env.CHAPPIE_TEST_TOKEN,
    { polling: true }
  );
} else if (process.env.NODE_ENV === 'prod') {
  bot = new TelegramBot(process.env.CHAPPIE_TOKEN, {
    webHook: { port: process.env.PORT },
  });
  bot.setWebHook(`${process.env.WEB_HOOK}${bot.token}`);
}

module.exports = bot