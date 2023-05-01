const bot = require('../bot')
const { getPurchaseOptions } = require('../utils');
const {
  messagesEnum: { PAID_USER_BENEFITS },
  message,
} = require('../messages');


async function handlePurchase({ chatId, logger, user }) {
  const { langCode, translate } = user
  
  logger.info(`sending purchase plans to ${chatId}`)
  bot.sendMessage(
    chatId,
    message(PAID_USER_BENEFITS, langCode, translate, { parse_mode: 'HTML' }),
    {
      reply_markup: {
        inline_keyboard: getPurchaseOptions(),
      },
    }
  );
}

module.exports = handlePurchase