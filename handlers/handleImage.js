const bot = require('../bot');
const {
  messagesEnum: { IMAGE_GEN_HELP, BROKE_MSG },
  message,
} = require('../messages');
const { imageWait } = require('../rateLimit');
const { TOKENS_PER_IMAGE } = require('../constants');
const {
  getImage,
  wait,
  getResponseOptions,
  tomorrowMidnight,
  getReferralLink,
  getPurchaseOptions,
} = require('../utils');
const { v4: uuid } = require('uuid');
const { updateUserTokens, saveConversation } = require('../db/utils');
const cloudinary = require('cloudinary').v2;
const { User } = require('../db/models');

cloudinary.config({
  cloud_name: 'diaghq7eh',
  api_key: '928487383554481',
  api_secret: '4GH-XRn_4xW1nsS_15x3uMkk9VY',
});

async function handleImage({
  logger,
  chatId,
  date,
  langCode,
  user,
  messageId,
  imagePrompt,
}) {
  const { translate } = user;
  logger.info(`it's an image`);
  if (!imagePrompt.trim().length) {
    logger.info(`the guy doesnt know how use the /image command🙄`);
    bot.sendMessage(chatId, message(IMAGE_GEN_HELP, langCode, translate), {
      parse_mode: 'HTML',
    });
    return;
  }
  if (
    (user.paid &&
      user.tokens.purchased + user.tokens.referral < TOKENS_PER_IMAGE) ||
    (!user.paid && user.tokens.referral + user.tokens.free < TOKENS_PER_IMAGE)
  ) {
    logger.info(`he doesnt have enough tokens to generate an image🤣`);
    bot.sendMessage(
      chatId,
      message(BROKE_MSG, langCode, translate, {
        tomorrowMidNight: new Date(tomorrowMidnight()),
        reflink: getReferralLink(chatId),
      }),
      {
        reply_markup: {
          inline_keyboard: getPurchaseOptions(),
        },
        parse_mode: 'HTML',
      }
    );
    return;
  }
  if (!user.paid) await wait(chatId);
  await imageWait(logger);
  logger.info(`generating photo`);
  const imgUrl = await getImage(imagePrompt);

  if (!user.paid) updateAvailableFreeTokens(TOKENS_PER_IMAGE);

  logger.info(`updating user tokens`);
  await updateUserTokens(logger, chatId, TOKENS_PER_IMAGE, user);

  if (
    user.paid &&
    user.tokens.purchased + user.tokens.referral - TOKENS_PER_IMAGE < 1
  ) {
    logger.info(`demote paid user`);
    User.findOneAndUpdate({ chatTgId: chatId }, { paid: false });
  }

  logger.info(`sending photo`);
  bot
    .sendPhoto(chatId, imgUrl, getResponseOptions(messageId))
    .then(() => logger.info(`photo sent✅`))
    .catch((err) =>
      logger.error(`error while seding photo message_id=${messageId}`, err)
    );

  logger.info(`uploading the image to cloudinary`);
  const { secure_url } = await cloudinary.uploader.upload(imgUrl, {
    public_id: uuid(),
    folder: chatId,
  });

  logger.info(`saving the conversation type=image`);
  await saveConversation({
    logger,
    messageId,
    user,
    type: 'image',
    text: imagePrompt,
    response: secure_url,
    tokens: TOKENS_PER_IMAGE,
    date: date,
  });
  logger.info(`MashaAllah, we've successfully service the /image request😌`); // TODO actually we can only confidently say that when bot.sendMessage is also successful
}

module.exports = handleImage;
