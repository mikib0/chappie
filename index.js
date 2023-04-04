if (process.env.NODE_ENV === 'dev') require('dotenv').config();
const { User, Conversation } = require('./models')
const TelegramBot = require('node-telegram-bot-api');
const { getResponseText } = require('./utils')
const chappieModelUpdateAnnouncement = require('./chappie_model_update_announcement')

let bot = null;

if (process.env.NODE_ENV === 'dev') {
  bot = new TelegramBot(process.env.CHAPPIE_TEST_TOKEN, { polling: true });
} else if (process.env.NODE_ENV === 'prod') {
  bot = new TelegramBot(process.env.CHAPPIE_TOKEN, {
    webHook: { port: process.env.PORT },
  });
  bot.setWebHook(`https://chappie.onrender.com/bot${bot.token}`);
}

bot.on('message', async (msg) => {
  console.log(msg)
  try {
    if (msg.text.match(/\/start/))
      return bot.sendMessage(
        msg.chat.id,
        `Welcome to Chappie, a Telegram bot that uses the OpenAI API to allow users to communicate with a large language model directly on the Telegram platform. We are excited to share the first version of Chappie with you and hope you will find it a useful and engaging tool for interacting with a language model in real-time.`
      );

    console.log('MESSAGE OBJECT', msg);
    // set 'typing' status
    bot.sendChatAction(msg.chat.id, 'typing')
    await new Promise(resolve=> setTimeout(resolve, 4000))
    // get chat response
    const responseText = await getResponseText(msg.text);
    bot.sendMessage(msg.chat.id, responseText);

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
            user: user._id,
            text: msg.text,
            response: responseText,
            date: new Date(msg.date * 1000),
          }).save();
        } catch (error) {
          console.log('SAVING MSG ERROR:', error);
        }
      }
    );
  } catch (error) {
    console.log(error.response);
    bot.sendMessage(
      msg.chat.id,
      "sorry we've messed up...please try resending your message. Mail mikibo.hamilton@aleeas.com or contact @miki_b0 on telegram if the problem persists."
    );
  }
});

bot.on('callback_query', (query) => {
  if (query.data.startsWith('translate_chappie_uses_chatgpt_'))
    bot.editMessageText(translations[query.data.substr(-2)], {
      chat_id: query.message.chat.id,
      message_id: query.message.message_id,
      ...chappieModelUpdateAnnouncement.options,
    });
});

User.find({}).then((users) => {
  users.forEach((user) => {
    bot.sendMessage(
      user.chatTgId,
      chappieModelUpdateAnnouncement.translations.en,
      chappieModelUpdateAnnouncement.options
    );
  });
});