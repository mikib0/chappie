const { DAILY_INCOMING, MAX_TOKENS } = require('../constants');
const models = require('./models');
const { User, Conversation } = models;
const redis = require('./redis');
const { tomorrowMidnight } = require('../utils');

// TODO this operation must not fail
async function updateUserTokens(logger, chatId, totalTokens, user) {
  const tokens = user.tokens;

  const update = {
    purchased: tokens.purchased,
    referral: tokens.referral,
    free: tokens.free,
  };
  const userFreeTokens = DAILY_INCOMING + tokens.free;

  if (user.paid) {
    if (update.purchased > totalTokens) {
      update.purchased = update.purchased - totalTokens;
    } else {
      const remainingTokens = Math.abs(update.purchased - totalTokens);
      update.referral = update.referral - remainingTokens;
      update.purchased = 0;
    }
  } else {
    if (userFreeTokens > totalTokens) {
      update.free = update.free - totalTokens;
    } else {
      update.free = -DAILY_INCOMING;
      const remainingTokens = Math.abs(userFreeTokens - totalTokens);
      update.referral = update.referral - remainingTokens;
    }
  }

  try {
    // TODO (userId)
    await User.findOneAndUpdate(
      { chatTgId: chatId },
      {
        $set: {
          'tokens.purchased': update.purchased,
          'tokens.free': update.free,
          'tokens.referral': update.referral < 0 ? 0 : update.referral // TODO(until openai fixes maxTokens),
        },
      }
    );
    logger.info(`user tokens updated`);
  } catch (err) {
    logger.error('error while updating uset tokens', err);
  }
}

// TODO use doc comment
async function updateOrCreateUser(msg) {
  // update the user info if the user exists else create a new user. and return the updated or created document
  let user = await User.findOneAndUpdate(
    { chatTgId: msg.chat.id },
    {
      chatTgId: msg.chat.id,
      firstName: msg.chat.first_name,
      lastName: msg.chat.last_name,
      username: msg.chat.username,
      langCode: msg.from.language_code ?? 'en',
    },
    { upsert: false }
  );
// TODO what if i can just set default values for the fields 
    if (!user) {
      user = await User({
        chatTgId: msg.chat.id,
        firstName: msg.chat.first_name,
        lastName: msg.chat.last_name,
        username: msg.chat.username,
        langCode: msg.from.language_code ?? 'en',
        translate: true,
        tokens: {
          purchased: 0,
          referral: 0,
          free: 0,
          freeTokens_expiryDate_ms: tomorrowMidnight(),
        },
        purchases: [],
        paid: false,
      }).save();
    }

    return user;
}

async function saveConversation({
  logger,
  messageId,
  user,
  type,
  text,
  response,
  date,
  tokens,
  finishReason,
}) {
  try {
    // save message to db
    const conversation = {
      messageId,
      user: user._id,
      type,
      text,
      response,
      tokens,
      date: new Date(date * 1000),
    };
    // if (user.isHavingDialog) conversation.dialogId = user.currentDialogId;
    // TODO(dialog update) we check for reply_to message instead of isHavingDialog
    if (finishReason == 'content_filter') conversation.flagged = true;
    await new Conversation(conversation).save();
    logger.info(`Alhamdulillah, conversation saved!😌`);
  } catch (error) {
    logger.error(
      `an error occured while saving conversation message_id=${messageId} mongo_userId=${user._id}`,
      error
    );
  }
}

async function getContext(dialogId) {
  const context = [];
  const dialog = await Conversation.find({ dialogId });
  dialog.forEach((conversation) => {
    context.push(
      { role: 'user', content: conversation.text },
      { role: 'assistant', content: conversation.response }
    );
  });
  return context;
}

async function maalCanHandle(maxTokens) {
  const maalTokens = Number.parseInt(await redis.decrBy('maal', maxTokens));
  if (maalTokens < 0) {
    return false;
  }
  return true;
}

async function updateMaal(maxTokens, consumedTokens) {
  redis.incrBy('maal', maxTokens - consumedTokens);
}

async function updateStock(logger, tokens) {
  const newStock = await redis.decrBy('stock', tokens);
  if (newStock < 0) {
    logger.notice(`we've ran out of stock!!`);
  }
}

async function checkStock(tokens) {
  const stock = await redis.get('stock');
  if (stock > tokens) {
    return true;
  }
  return false;
}

async function userExists(chatId) {
  const exists = !!(await User.exists({ chatTgId: chatId })); // TODO(userId) damn! had i saved userTgId, this filter would have been more accurate because
  return exists;
}

module.exports = {
  updateUserTokens,
  updateOrCreateUser,
  saveConversation,
  getContext,
  maalCanHandle,
  updateMaal,
  checkStock,
  updateStock,
  userExists,
};
