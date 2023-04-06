if (process.env.NODE_ENV === 'dev') require('dotenv').config();
const { User, Conversation } = require('./models')
const TelegramBot = require('node-telegram-bot-api');
const { getResponseText } = require('./utils')
const chappieModelUpdateAnnouncement = require('./chappie_model_update_announcement')
const Sentry = require('@sentry/node');

Sentry.init({
  dsn: 'https://6ba41d8320c04089864253cf1faabbd6@o4504962327576576.ingest.sentry.io/4504967188119552',

  tracesSampleRate: 0.2,
});


let bot = null;
const WAIT_TIME = 3000 // TODO: move this to env
const ERROR_MESSAGE = "sorry we've messed up...please try resending your message. Mail mikibo.hamilton@aleeas.com or contact @miki_b0 on telegram if the problem persists."

async function wait(chatId){
  if (process.env.NODE_ENV === 'prod') { // dont waste time in dev
      // set 'typing' status
      await new Promise((resolve) => setTimeout(resolve, WAIT_TIME));
      bot.sendChatAction(chatId, 'typing');
    }
}

function sendMessage(chatId, text, msgId) {
  const responseOptions = {
    reply_markup: {
      inline_keyboard: [
        [
          // {
          //   text: '«',
          //   callback_data: `prev_` + msg.message_id
          // },
          {
            text: 'regenerate',
            callback_data: 'regenerate_' + msgId,
          },
          // next,
        ],
      ],
    },
    reply_to_message_id: msgId,
  };

  return bot.sendMessage(chatId, text, responseOptions).catch(Sentry.captureException);
}

if (process.env.NODE_ENV === 'dev') {
  bot = new TelegramBot(process.env.CHAPPIE_TEST_TOKEN, { polling: true });
} else if (process.env.NODE_ENV === 'prod') {
  bot = new TelegramBot(process.env.CHAPPIE_TOKEN, {
    webHook: { port: process.env.PORT },
  });
  bot.setWebHook(`https://chappie.onrender.com/bot${bot.token}`);
}

bot.on('message', async (msg) => {
  try {
    if (msg.text.match(/\/start/))
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

    await wait(msg.chat.id);
    // get chat response
    const responseText = await getResponseText(msg.text);
    sendMessage(msg.chat.id, responseText, msg.message_id);

    // create user if doesnt exist
    User.findOneAndUpdate(
      { chatTgId: msg.chat.id },
      {
        chatTgId: msg.chat.id,
        firstName: msg.chat.first_name,
        lastName: msg.chat.last_name,
        username: msg.chat.username,
      },
      { upsert: true, new: true },
      async (err, user) => {
        if(err) Sentry.captureException(err);
        try {
          // save message to db
          await new Conversation({
            messageId: msg.message_id,
            user: user._id,
            text: msg.text,
            response: responseText,
            date: new Date(msg.date * 1000),
          }).save();
        } catch (error) {
          Sentry.captureException(error);
        }
      }
    ); // TODO handle rejection!
  } catch (error) {
    Sentry.captureException(error);
    sendMessage(
      msg.chat.id,
      ERROR_MESSAGE,
      msg.message_id
    )
  }
});

bot.on('callback_query', async (query) => {
  if (query.data.startsWith('regenerate_')) {
    const messageId = Number(query.data.substr(11));
    const message = await Conversation.findOne({ messageId });
    await wait(query.message.chat.id);

    try {
      const responseText = await getResponseText(message.text); // TODO handle rejection!
      sendMessage(query.message.chat.id, responseText, messageId)
    } catch (err) {
      sendMessage(query.message.chat.id, ERROR_MESSAGE, messageId);
    }
  }
  if (query.data.startsWith('translate_chappie_uses_chatgpt_'))
    bot.editMessageText(translations[query.data.substr(-2)], {
      chat_id: query.message.chat.id,
      message_id: query.message.message_id,
      ...chappieModelUpdateAnnouncement.options,
    });
});

// User.find({}).then((users) => {
//   users.reverse().forEach((user) => {
//     bot
//       .sendMessage(
//         user.chatTgId,
//         chappieModelUpdateAnnouncement.translations.en,
//         chappieModelUpdateAnnouncement.options
//       )
//       .catch((err) => console.log(err));
//   });
// });