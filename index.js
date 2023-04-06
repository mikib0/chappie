if (process.env.NODE_ENV === 'dev') require('dotenv').config();
const { User, Conversation } = require('./models')
const TelegramBot = require('node-telegram-bot-api');
const { getResponseText } = require('./utils')
const chappieModelUpdateAnnouncement = require('./chappie_model_update_announcement')

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

  return bot.sendMessage(chatId, text, responseOptions);
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
        .catch(console.log);

    await wait(msg.chat.id);
    // get chat response
    const responseText = await getResponseText(msg.text);

    sendMessage(msg.chat.id, responseText, msg.message_id).catch(console.log);

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
          console.log('SAVING MSG ERROR:', error);
        }
      }
    ); // TODO handle rejection!
  } catch (error) {
    console.log(error);
    sendMessage(
      msg.chat.id,
      ERROR_MESSAGE,
      msg.message_id
    ).catch(console.log);
  }
});

bot.on('callback_query', async (query) => {
  if (query.data.startsWith('regenerate_')) {
    const messageId = Number(query.data.substr(11));
    const message = await Conversation.findOne({ messageId });
    await wait(query.message.chat.id);

    try {
      const responseText = await getResponseText(message.text); // TODO handle rejection!
      sendMessage(query.message.chat.id, responseText, messageId).catch(
        console.log
      );
    } catch (err) {
      sendMessage(query.message.chat.id, ERROR_MESSAGE, messageId).catch(console.log);
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