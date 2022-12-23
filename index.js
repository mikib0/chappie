if (process.env.NODE_ENV === 'dev') require('dotenv').config();
const { User, Conversation } = require('./models')
const TelegramBot = require('node-telegram-bot-api');
const { getResponseText } = require('./utils')

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
  try {
    if (msg.text.match(/\/start/))
      return bot.sendMessage(
        msg.chat.id,
        `Welcome to Chappie, a Telegram bot that uses the OpenAI API to allow users to communicate with a large language model directly on the Telegram platform. We are excited to share the first version of Chappie with you and hope you will find it a useful and engaging tool for interacting with a language model in real-time.`
      );

    console.log('MESSAGE OBJECT', msg);
    // handle incoming message
    const responseText = await getResponseText(msg.text);
    console.log('RESPONSE', responseText);
    bot.sendMessage(msg.chat.id, responseText);

    // create user if doesnt exist
    User.findOneAndUpdate(
      { chatTgId: msg.chat.id },
      {
        chatTgId: msg.chat.id,
        firstName: msg.chat.first_name,
        username: msg.chat.username,
      },
      { upsert: true, new: true },
      async (err, user) => {
        console.log('USER', user);
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
    console.log(error.message);
    bot.sendMessage(
      msg.chat.id,
      "sorry we've messed up...please try resending your message. Mail mikibo.hamilton@aleeas.com or contact @miki_b0 on telegram if the problem persists."
    );
  }
});
