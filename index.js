if (process.env.NODE_ENV === 'dev') require('dotenv').config();

const TelegramBot = require('node-telegram-bot-api');
let bot = null;

if (process.env.NODE_ENV === 'dev') {
  bot = new TelegramBot(process.env.TG_TOKEN, { polling: true });
} else if (process.env.NODE_ENV === 'prod') {
  bot = new TelegramBot(process.env.TG_TOKEN, {
    webHook: { port: process.env.PORT },
  });
  bot.setWebHook(`https://chappie.onrender.com/bot${bot.token}`);
}
const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function getChatGPTResponse(prompt) {
  const response = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt,
    temperature: 0.6,
    max_tokens: 1024,
  });

  // Get the response from the chatbot
  const chatGPTResponse = response.data.choices[0].text;
  return chatGPTResponse;
}

bot.on('message', async (msg) => {
  try {
    if (msg.text.match(/\/start/))
      return bot.sendMessage(
        msg.chat.id,
        `Welcome to Chappie, a Telegram bot that uses the OpenAI API to allow users to communicate with a large language model directly on the Telegram platform. We are excited to share the first version of Chappie with you and hope you will find it a useful and engaging tool for interacting with a language model in real-time.`
      );;
    console.log(msg.text);
    // handle incoming message
    const chatGPTResponse = await getChatGPTResponse(msg.text);
    console.log(chatGPTResponse);
    bot.sendMessage(msg.chat.id, chatGPTResponse);
  } catch (error) {
    console.log(error.message);
    bot.sendMessage(
      msg.chat.id,
      "sorry we've messed up...please try resending your message. Mail mikibo.hamilton@aleeas.com or contact @miki_b0 on telegram if the problem persists."
    );
  }
});
