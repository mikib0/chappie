const { textWait, updateTokensUsage } = require('../rateLimit');
const {
  wait,
  getResponseText,
  getResponseOptions,
  tomorrowMidnight,
  getReferralLink,
  getPurchaseOptions,
} = require('../utils');
const bot = require('../bot');
const {
  getContext,
  updateUserTokens,
  saveConversation,
  maalCanHandle,
  updateMaal,
} = require('../db/utils');
const { User } = require('../db/models');
const { MAX_TOKENS, DAILY_INCOMING } = require('../constants');
const {
  message,
  messagesEnum: { BROKE_MSG, NO_FREE_TOKENS },
} = require('../messages');

async function handleText({
  logger,
  chatId,
  text,
  date,
  user,
  messageId,
  msg,
}) {
  let maxTokens;
  if (user.paid) {
    maxTokens = Math.min(
      MAX_TOKENS,
      user.tokens.purchased + user.tokens.referral
    );
  } else {
    if (user.tokens.freeTokens_expiryDate_ms < Date.now()) {
      logger.debug(`${DAILY_INCOMING} daily incoming tokens for you!`);
      user = await User.findOneAndUpdate(
        { chatTgId: chatId },
        {
          $set: {
            'tokens.free': 0,
            'tokens.freeTokens_expiryDate_ms': tomorrowMidnight(),
          },
        },
        {
          new: true,
        }
      );
    }

    // instead of initially giving him DAILY_INCOMING
    // and substract usage till it reaches 0,...
    // we substract usage from 0 till it reaches -DAILY_INCOMING
    // so user.tokens.free is actually = -consumedTokens
    const userFreeTokens = DAILY_INCOMING + user.tokens.free;
    const hasFreeTokens = userFreeTokens > 0; // TODO(openai fixes) ==
    const hasReferralTokens = user.tokens.referral > 0; // TODO(openai fixes) ==

    // if the free user doesnt have freetokens and referral tokens
    if (!hasFreeTokens && !hasReferralTokens) {
      logger.debug(`this bro is broke🤣`);
      bot
        .sendMessage(
          chatId,
          message(BROKE_MSG, user.langCode, user.translate, {
            tomorrowMidNight: new Date(tomorrowMidnight()),
            reflink: getReferralLink(chatId),
          }),
          {
            reply_markup: {
              inline_keyboard: getPurchaseOptions(),
            },
            parse_mode: 'HTML',
          }
        )
        .catch((err) => logger.error(`error while sending BROKE_MSG`, err));
      return;
    }

    maxTokens = Math.min(MAX_TOKENS, user.tokens.referral + userFreeTokens);

    // if maal can't handle
    if (!(await maalCanHandle(maxTokens))) {
      logger.debug(`sorry, maal cant feed you`);
      updateMaal(maxTokens, 0);
      logger.notice(`baitul mal is running out of fund🚨`);
      bot
        .sendMessage(
          chatId,
          `<i>${message(NO_FREE_TOKENS, user.langCode, user.translate)}</i>`,
          {
            reply_markup: {
              inline_keyboard: getPurchaseOptions(),
            },
            parse_mode: 'HTML',
          }
        )
        .catch((err) =>
          logger.error(`error while sending NO_FREE_TOKENS`, err)
        );
      return;
    }
  }

  if (!user.paid) await wait(chatId, bot);
  await textWait(logger, maxTokens);
  const { responseText, totalTokens, finishReason } = await getResponseText(
    logger,
    [],
    text,
    maxTokens
  );

  await updateUserTokens(logger, chatId, totalTokens, user);
  await updateTokensUsage(maxTokens, totalTokens);

  if (!user.paid) updateMaal(maxTokens, totalTokens);
  if (user.paid && user.tokens.purchased - totalTokens < 1) { 
    logger.info(`demote paid user`);
    await User.findOneAndUpdate({ chatTgId: chatId }, { paid: false });
  }

  logger.info(`sending text response`);
  bot
    .sendMessage(chatId, responseText, getResponseOptions(messageId))
    .then(() => logger.info(`text response sent✅`))
    .catch((err) =>
      logger.error(
        `there was an error while sending text reponse messageId=${messageId}`,
        err
      )
    );

  await saveConversation({
    logger,
    messageId,
    user,
    type: 'text',
    text,
    response: responseText,
    date,
    tokens: totalTokens,
    finishReason,
  });
}

module.exports = handleText;
