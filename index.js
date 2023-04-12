if (process.env.NODE_ENV === 'dev') require('dotenv').config();
const { User, Conversation } = require('./models')
const TelegramBot = require('node-telegram-bot-api');
const { getResponseText, getImage } = require('./utils')
const chappieModelUpdateAnnouncement = require('./chappie_model_update_announcement') // TODO just make a new module, announcements.js, that holds all announcements
const imageGenarationAnnounment = require('./image_generation_announment');
const Sentry = require('@sentry/node');
const { v4: uuid } = require('uuid');

Sentry.init({
  dsn: 'https://6ba41d8320c04089864253cf1faabbd6@o4504962327576576.ingest.sentry.io/4504967188119552',
  
  tracesSampleRate: 0.2,
});

let bot = null;
const WAIT_TIME = 3000; // TODO: move this to env
const ERROR_MESSAGE =
  "sorry we've messed up...please try resending your message. Mail mikibo.hamilton@aleeas.com or contact @miki_b0 on telegram if the problem persists.";
const MAX_TOKEN_LIMIT = 4096;

// init bot
if (process.env.NODE_ENV === 'dev') {
  bot = new TelegramBot(process.env.CHAPPIE_TEST_TOKEN, { polling: true });
} else if (process.env.NODE_ENV === 'prod') {
  bot = new TelegramBot(process.env.CHAPPIE_TOKEN, {
    webHook: { port: process.env.PORT },
  });
  bot.setWebHook(`https://chappie.onrender.com/bot${bot.token}`);
}

async function wait(chatId) {
  if (process.env.NODE_ENV === 'prod') {
    // dont waste time in dev
    // set 'typing' status
    await new Promise((resolve) => setTimeout(resolve, WAIT_TIME));
    bot.sendChatAction(chatId, 'typing');
  }
}

function sendMessage(chatId, text, msgId) {
  // TODO reply even when message is not found
  const responseOptions = {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: 'regenerate',
            callback_data: 'regenerate_' + msgId,
          },
        ],
      ],
    },
    reply_to_message_id: msgId,
  };

  return bot
    .sendMessage(chatId, text, responseOptions)
    .catch(Sentry.captureException);
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

async function saveConversation(msg, user, responseText, finishReason) {
  try {
    // save message to db
    const conversation = {
      messageId: msg.message_id,
      user: user._id,
      text: msg.text,
      response: responseText,
      date: new Date(msg.date * 1000),
    };
    if (user.isHavingDialog) conversation.dialogId = user.currentDialogId;
    if (finishReason == 'content_filter') conversation.flagged = true;
    await new Conversation(conversation).save();
  } catch (error) {
    Sentry.captureException(error);
  }
}

// TODO use doc comment
async function updateOrCreateUser(msg) {
  // update the user info if the user exists else create a new user. and return the updated or created document
  return User.findOneAndUpdate(
    { chatTgId: msg.chat.id },
    {
      chatTgId: msg.chat.id,
      firstName: msg.chat.first_name,
      lastName: msg.chat.last_name,
      username: msg.chat.username,
    },
    { upsert: true, new: true }
    );
  }

async function getAndSendResponse(msg, user) {
  const { isHavingDialog, currentDialogId } = user;
  if (isHavingDialog) {
    const { message_id: warningMessage_Id } = await bot.sendMessage(
      msg.chat.id,
      "Responses in a dialog might be slower and consume more tokens. We recommend that you end it (/enddialog) when you don't need it." // TODO format  as system message
    );
    const context = await getContext(currentDialogId);

    await wait(msg.chat.id);
    const { responseText, finishReason, totalTokens } = await getResponseText(
      context,
      msg.text
    );

    await bot.deleteMessage(msg.chat.id, warningMessage_Id)
    sendMessage(msg.chat.id, responseText, msg.message_id)

    if(totalTokens == MAX_TOKEN_LIMIT){
      await User.findOneAndUpdate(
        { chatTgId: msg.chat.id },
        { isHavingDialog: false }
      );
      bot.sendMessage(
        msg.chat.id,
        'This dialog has exceeded the max limit and has been automatically ended. You can start a new one by using the /begindialog command' // TODO also tell them to consider using light dialog
      ); // TODO format  as system message
    }
    
    return { responseText, finishReason };
  }

  await wait(msg.chat.id);
  // get chat response
  const { responseText, finishReason } = await getResponseText(
    [],
    msg.text
  );
  sendMessage(msg.chat.id, responseText, msg.message_id);

  return { responseText, finishReason };
}


bot.on('message', async (msg) => {
  const user = await updateOrCreateUser(msg);
  try {
    if (msg.text.match(/^\/start$/)) {
      // TODO make sendMessage universal by accepting object as argument
      // create user if doesnt exist
      updateOrCreateUser(msg);
      return bot
        .sendMessage(
          msg.chat.id,
          `
          Hello, <b>${msg.chat.first_name}</b>!
Welcome to chappie, your AI assistant powered by chatGPT. Talk to me and I'll give you human like response. Try it now!

Join <a href="t.me/chappieupdates">this channel</a> for updates about me.
        `,
          {
            parse_mode: 'HTML',
          }
        )
        .catch(Sentry.captureException);
    } else if (msg.text.match(/^\/begindialog$/)) {
      if (!user.isHavingDialog) {
        await User.findOneAndUpdate(
          { chatTgId: msg.chat.id },
          { isHavingDialog: true, currentDialogId: uuid() }
        );
        return bot
          .sendMessage(
            msg.chat.id,
            'Dialog has started. Please note that reponses in a dialog might be slower and consume more tokens. You can end the dialog (by sending /enddialog command).'
          )
          .catch(Sentry.captureException);
      } else {
        return bot
          .sendMessage(msg.chat.id, 'There is already an ongoing dialog.')
          .catch(Sentry.captureException);
      }
    } else if (msg.text.match(/^\/enddialog$/)) {
      await User.findOneAndUpdate(
        { chatTgId: msg.chat.id },
        { isHavingDialog: false }
      );
      return bot
        .sendMessage(msg.chat.id, 'Dialog has ended.')
        .catch(Sentry.captureException);
    } else if(msg.text.match(/^\/image$/)){
      return bot.sendMessage(
        msg.chat.id,
        `
      📷 Image generation \n\n Type: /image followed by a detailed image description \n Example: /image a white siamese cat
      `) // TODO replace '[new feature] ...' title with 'image generation' in translations so and add translation buttons to this message
    } else if(msg.text.match(/^\/image/)){
      const imgPrompt = msg.text.substr(6) // 6 is the length of '/image'
      await wait(msg.chat.id);
      const imgUrl = await getImage(imgPrompt)
      return bot.sendPhoto(msg.chat.id, imgUrl, {
        reply_to_message_id: msg.message_id,
      });
    }

    const { responseText, finishReason } = await getAndSendResponse(msg, user);

    try {
      await saveConversation(msg, user, responseText, finishReason);
    } catch (err) {
      Sentry.captureException(err);
    }
  } catch (error) {
    Sentry.captureException(error);
    sendMessage(msg.chat.id, ERROR_MESSAGE, msg.message_id);
  }
});

bot.on('callback_query', async (query) => {
  const chatId = query.message.chat.id;
  if (query.data.startsWith('regenerate_')) {
    const user = await updateOrCreateUser(query.message);
    const messageId = Number(query.data.substr(11));

    try {
      const { responseText, finishReason } = await getAndSendResponse(
        query.message.reply_to_message,
        user
      );

      try {
        await saveConversation(
          query.message.reply_to_message,
          user,
          responseText,
          finishReason
        );
      } catch (err) {
        Sentry.captureException(err);
      }
    } catch (err) {
      Sentry.captureException(err);
      sendMessage(chatId, ERROR_MESSAGE, messageId);
    }
  } else if (query.data.startsWith('translate_chappie_uses_chatgpt_'))
    bot.editMessageText(
      chappieModelUpdateAnnouncement.translations[query.data.substr(-2)],
      {
        chat_id: chatId,
        message_id: query.message.message_id,
        ...chappieModelUpdateAnnouncement.options,
      }
    ).catch(err=>Sentry.captureException(err));
  else if (query.data.startsWith('translate_image_generation_'))
    bot.editMessageText(
      imageGenarationAnnounment.translations[query.data.substr(-2)],
      {
        chat_id: query.message.chat.id,
        message_id: query.message.message_id,
        ...imageGenarationAnnounment.options,
      }
    ).catch(err=> Sentry.captureException(err));

});