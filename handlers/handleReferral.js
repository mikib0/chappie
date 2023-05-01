const { enigma } = require('../utils');
const { User } = require('../db/models');
const { messagesEnum: { START_MSG }, message } = require('../messages')
const { REFERRAL_REWARD } = require('../constants')
const bot = require('../bot');
const { userExists, updateOrCreateUser } = require('../db/utils');


async function handleReferral({logger, refreeId, chatId, langCode, msg}) {
  logger.info(`ah it's a referral`);
  refreeId = enigma.decrypt(refreeId);
  const referredUserExists = await userExists(chatId)
  const refreeExists = !!(await User.exists({ chatTgId: refreeId })); // TODO(userId)
  if (referredUserExists || !refreeExists || refreeId == chatId) {
    logger.info(
      `oops its a bad referral referredUser=${chatId}(exists=${referredUserExists}) refree=${refreeId}(exists=${refreeExists}) self_referral=${
        refreeId == chatId
      }`
    );
    logger.info(`sending START_MSG anyways😏`);
    bot
      .sendMessage(chatId, message(START_MSG, langCode, true, { first_name: msg.chat.first_name }), {
        parse_mode: 'HTML',
      })
      .catch((err) => logger.error(`error while sending START_MSG`, err));
    return;
  }

  logger.info(`rewarding refree ${refreeId}👏`);
  await User.findOneAndUpdate(
    { chatTgId: refreeId },
    { $inc: { "tokens.referral": REFERRAL_REWARD } }
  );

  logger.info(`sending START_MSG`);
  bot
    .sendMessage(
      chatId,
      message(START_MSG, langCode, true, { first_name: msg.chat.first_name }),
      {
        parse_mode: 'HTML',
      }
    )
    .catch((err) => logger.error(`error while sending START_MSG`, err));
    
  logger.info(`creating new user`)
  await updateOrCreateUser(msg)
   await User.findOneAndUpdate(
     { chatTgId: chatId },
     {
       $set: {
         'tokens.free': 0,
         'tokens.freeTokens_expiryDate_ms': tomorrowMidnight(),
       },
     },
   );
  logger.info(`${refreeId} referred ${chatId}✅`);
}

module.exports = handleReferral;
