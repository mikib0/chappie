if (process.env.NODE_ENV === 'dev') require('dotenv').config();
const {
  models: {User},
  utils: { updateOrCreateUser },
} = require('./db');
const {
  enigma,
  kFy,
  getResponseOptions,
  getPurchaseOptions,
  getReferralLink,
  getAccountKeyboard,
} = require('./utils');
const bot = require('./bot');
const { plans, DAILY_INCOMING } = require('./constants');
const { translations, options } = require('./chappieisback_translations')
const { v4: uuid } = require('uuid');
// const paymentServer = require('./payment-server');
const {
  messagesEnum: {
    START_MSG,
    RESPONSE_GEN_ERROR_MESSAGE,
    PURCHASED,
    FREE,
    PAID,
    REFERRAL,
    REFERRAL_MSG,
    HELP,
    SUPPORT,
    PAID_USER_BENEFITS,
    ACCOUNT_INFO,
    BACK_TO_ACCOUNT,
    CHECKOUT,
    PURCHASE,
    BACK_TO_PURCHASE,
    PURCHASE_TOKENS,
    TRANSLATION,
    DONATE,
  },
  message,
} = require('./messages');

const logFather = require('./logger');
const {
  handleReferral,
  handlePurchase,
  handleImage,
  handleText,
} = require('./handlers');
const executionId = uuid();
const processLogger = logFather.child({ label: 'process', id: executionId });

processLogger.info('app starts');
// const PORT = process.env.PORT ?? 8922;
// paymentServer.listen(PORT, () => {
//   processLogger.info(`Server listening at ${PORT}`);
// });

async function getAccountInfo(msg){
  const user = await updateOrCreateUser(msg); // TODO this is redundant
  const { paid, tokens, firstName, langCode, translate } = user

  return message(ACCOUNT_INFO, langCode, translate, {
    firstName,
    accountType: paid
      ? message(PAID, langCode, translate)
      : message(FREE, langCode, translate),
    refLink: getReferralLink(msg.chat.id),
    purchased: paid
      ? message(PURCHASED, langCode) + ': ' + user.tokens.purchased + '\n\t'
      : '',
    referral: tokens.referral,
    free: paid
      ? ''
      : message(FREE, langCode, translate) +
        ': ' +
        Math.abs(DAILY_INCOMING + tokens.free) +
        '\n',
    referralMsg: message(REFERRAL_MSG, langCode, translate),
  });
}

async function handleAccount(msg, langCode, translate, logger) {
  bot.sendMessage(msg.chat.id, await getAccountInfo(msg), {
    reply_markup: {
      inline_keyboard: getAccountKeyboard(langCode, translate),
    },
    parse_mode: 'HTML',
  }).catch(err=>logger.error(`error while sending message`, err));

  return;
}

bot.on('channel_post', (msg) => {
  logFather.child({ label: 'channel_post' }).info(msg);
});

async function handleOnText(msg, logger) {
  logger.info(`handling user ${msg.chat.id}`)
  if(new String(msg.chat.id).startsWith('-')) return;
  const chatId = msg.chat.id;
  const messageId = msg.message_id;
  const userTgId = msg.from.id;
  const text = msg.text;
  const langCode = msg.from.language_code ?? 'en';
  const date = msg.date;

  const startMatch = text.match(/^\/start$/);
  const begindialogMatch = text.match(/^\/begindialog$/);
  const enddialogMatch = text.match(/^\/enddialog$/);
  const referralMatch = text.match(/^\/start\s+(.+)/); // TODO the digit part wont match when we implement generating reflink with encrypted id
  const imageMatch = text.match(/^\/image\s*(.*)$/);
  const refLinkMatch = text.match(/^\/reflink/);
  const balanceMatch = text.match(/^\/balance/);
  const purchaseMatch = text.match(/^\/purchase/);
  const accountMatch = text.match(/^\/account/);
  const helpMatch = text.match(/^\/help/)
  const supportMatch = text.match(/^\/support/)
  
  const args = { logger, chatId, date, langCode, text, messageId };
  let user

  try {
    if (referralMatch) {
      handleReferral({ ...args, refreeId: referralMatch[1], msg });
      return;
    }
    // create user if doesnt exist
    logger.info('update or create user');
    user = await updateOrCreateUser(msg);
    args.user = user;
    if (startMatch) {
      logger.info('sending /start reply to user');
      bot
        .sendMessage(
          chatId,
          message(START_MSG, langCode, user.translate, {
            first_name: user.firstName,
          }),
          {
            parse_mode: 'HTML',
          }
        )
        .catch((err) => logger.error(`error while sending START_MSG`, err));
      return;
    } else if(helpMatch){
      logger.info(`pile is looking for help`)
      bot.sendMessage(chatId, message(HELP, langCode, user.translate)).catch(err=>logger.error(`error while sending HELP`, err))
    } else if(supportMatch){
      logger.info(`this guy wants to disbturb me with complaints🙄`);
      bot
        .sendMessage(chatId, message(SUPPORT, langCode, user.translate))
        .catch((err) => logger.error(`error while sending SUPPORT`, err));
    } else if (refLinkMatch) {
      logger.info(`the guy wants to get his referral link`);
      bot
        .sendMessage(chatId, `<code>${getReferralLink(chatId)}</code>`, {
          parse_mode: 'HTML',
        })
        .catch((err) => logger.error(`error while sending reflink`, err));
    } else if (balanceMatch) {
      logger.info(`pile wants to see his balance`);
      bot
        .sendMessage(
          chatId,
          user.paid
            ? `${message(PURCHASED, langCode, user.translate)}: ${
                user.tokens.purchased
              }\n${message(REFERRAL, langCode, user.translate)}: ${
                user.tokens.referral
              }`
            : `${message(FREE, langCode, user.translate)}: ${Math.abs(
                DAILY_INCOMING + user.tokens.free
              )}\n${message(REFERRAL, langCode, user.translate)}: ${
                user.tokens.referral
              }\n<i>${message(REFERRAL_MSG, langCode, user.translate)}</i>`,
          {
            parse_mode: 'HTML',
          }
        )
        .catch((err) => logger.error(`error while sending balance`, err));
    } else if (purchaseMatch) {
      handlePurchase(args);
    } else if (accountMatch) {
      handleAccount(msg, langCode, user.translate, logger);
    } else if (imageMatch) {
      handleImage({ ...args, imagePrompt: imageMatch[1] });
      return;
    } else {
      handleText({ ...args, msg });
    }
  } catch (error) {
    logger.error(
      `an error occured during the course of processing text`,
      error
    );
    bot
      .sendMessage(
        chatId,
        message(RESPONSE_GEN_ERROR_MESSAGE, langCode, user.translate),
        getResponseOptions(messageId)
      )
      .catch((err) =>
        logger.error(
          `an error occured while sending RESPONSE_GEN_ERROR_MESSAGE💀`,
          err
        )
      );
  }
}

bot.on('text', (msg) => {
  const logger = logFather.child({ label: 'on_text', id: uuid() });
  logger.info(`text received, messageId=${msg.message_id}`);
  handleOnText(msg, logger);
});

bot.on('callback_query', async (query) => {
  const chatId = query.message.chat.id;
  const messageId = query.message.message_id;
  const msg = query.message;
  const data = query.data;
  const user = await updateOrCreateUser(msg)
  const logger = logFather.child({ label: 'regenerate', id: uuid() });

  const { langCode, translate, chatTgId } = user

  if (data.startsWith('regenerate')) {
    const msgToRegenerate = query.message.reply_to_message;
    msgToRegenerate.date = query.message.date;
    logger.info(`regenerate message, message_id=${msgToRegenerate.message_id}`);
    handleOnText(msgToRegenerate, logger);
  } else if (data.startsWith('account')) {
    bot.editMessageText(await getAccountInfo(msg), {
      chat_id: chatId,
      message_id: messageId,
      reply_markup: {
        inline_keyboard: getAccountKeyboard(langCode, translate), // TODO (translation)
      },
      parse_mode: 'HTML',
    }).catch(err=>logger.error(`error while mounting accountInfo`, err));
  } else if (data.startsWith('purchase_options')) {
    bot.editMessageText(message(PAID_USER_BENEFITS, langCode, translate), {
      chat_id: chatId,
      message_id: messageId,
      reply_markup: {
        inline_keyboard: [
          ...getPurchaseOptions(chatId),
          [
            {
              text: message(BACK_TO_ACCOUNT, langCode, translate),
              callback_data: 'account',
            },
          ],
        ],
      },
    }).catch(err=>logger.error(`error while mounting purchase_options`));
  } else if (data.startsWith('purchase_')) {
    const thePlanName = data.substring('purchase_'.length);
    const thePlan = plans[thePlanName];
    bot.editMessageText(
      message(CHECKOUT, langCode, translate, {
        // TODO (translation)
        thePlanName,
        tokens: kFy(thePlan.tokens),
        price: thePlan.price,
      }),
      {
        chat_id: chatId,
        message_id: messageId,
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: message(PURCHASE, langCode, translate),
                url: `https://chappiepay.onrender.com/purchase?plan=${thePlanName}&uid=${enigma.encrypt(
                  chatId
                )}`,
              },
            ],
            [
              {
                text: message(BACK_TO_PURCHASE, langCode, translate),
                callback_data: 'purchase_options',
              },
            ],
          ],
        },
        parse_mode: 'HTML',
      }
    ).catch(err=>logger.error(`error while mounting purchase_`));
  } else if (data.startsWith('toggle_translation')) {
    await User.findOneAndUpdate(
      { chatTgId },
      { $set: { translate: !translate } },
      { new: true }
    );
    bot.editMessageText(await getAccountInfo(msg), {
      chat_id: chatId,
      message_id: messageId,
      reply_markup: {
        inline_keyboard: getAccountKeyboard(langCode, !translate), // TODO (translation)
      },
      parse_mode: 'HTML',
    }).catch(err=>logger.error(`error while mounting toggle_translation translate=${!translate}`, err));
  } else if (data.startsWith('translate_chapppieisback_')) {
    const lang = data.substring('translate_chapppieisback_'.length);
    bot
      .editMessageText(translations[lang], {
        chat_id: query.message.chat.id,
        message_id: messageId,
        ...options,
      })
      .catch((err) =>
        logger.error(`error while mounting translate_chapppieisback_ lang=${lang}`, err)
      );
  }
  // else if(data.startsWith('check_sub')){
  //   const channelUsername = 'chappie_updates'
  //   const chatMember = await bot.getChatMember(channelUsername, userId);
  //   if (chatMember.status === 'member' || chatMember.status === 'creator') {
  //     bot.editMessageText('You are a subscriber of the channel!', { chat_id: chatId, message_id: msgId });
  //   } else {
  //     bot.editMessageText('You have not subscribed!', { chat_id: chatId, message_id: msgId });
  //   }
  // }
});
