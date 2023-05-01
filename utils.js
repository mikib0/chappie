const { Configuration, OpenAIApi } = require('openai');
const { plans, WAIT_TIME } = require('./constants');
const bot = require('./bot');
const {
  message,
  messagesEnum: { PURCHASE_TOKENS, DONATE, TRANSLATION, REGENERATE },
} = require('./messages');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function getResponseText(logger, context, input, maxTokens) {
  // {
  //   role: 'system',
  //   content:
  //     'Your name is chappie, a helpful assistant.',
  // },
  const messages = context;
  messages.push(
    // {"role": "system", "content": "You are chappie, created by @miki_b0"},
    {
      role: 'user',
      content: input,
    }
  );

  // TODO may be i should call wait() here instead
  logger.info(`generating text reponse`);
  const completion = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages,
    temperature: 0.7, // TODO get value from env
    max_tokens: maxTokens,
  });

  const responseText = completion.data.choices[0].message.content;
  logger.info(
    `text response generated with tokens=${completion.data.usage.total_tokens}`
  );

  return {
    responseText,
    finishReason: completion.data.choices[0].finish_reason,
    totalTokens: completion.data.usage.total_tokens,
  };
}

async function getImage(prompt) {
  const response = await openai.createImage({
    prompt,
    n: 1,
    size: '512x512',
  });
  const image_url = response.data.data[0].url;
  return image_url;
}

const enigma = {
  encrypt(str) {
    // TODO return encrypted text
    return Buffer.from(new String(str), 'utf-8').toString('base64');
  },
  decrypt(str) {
    // TODO return decrypted text
    
    return Buffer.from(str, 'base64').toString('utf-8');
  },
};

function kFy(number) {
  return number / 1000 + 'k';
}

function getTokensFromPrice(price) {
  for (const [plan, planDetails] of Object.entries(plans)) {
    if (planDetails.price == price) {
      return planDetails.tokens;
    }
  }
}

async function wait(chatId) {
  if (process.env.NODE_ENV === 'prod') {
    // dont waste time in dev
    // set 'typing' status
    await new Promise((resolve) => setTimeout(resolve, WAIT_TIME));
    bot.sendChatAction(chatId, 'typing');
  }
}

function getResponseOptions(messageId, langCode) {
  return {
    // TODO reply even when message is not found
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: message(REGENERATE, langCode), // TODO (translation)
            callback_data: 'regenerate',
          },
        ],
      ],
    },
    reply_to_message_id: messageId,
  };
}

function tomorrowMidnight() {
  let now = new Date();
  let nextMidnight = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1,
    0,
    0,
    0,
    0
  );
  return nextMidnight.getTime();
}

function getPurchaseOptions() {
  return Object.entries(plans).map(([thePlan, thePlanDetails]) => {
    const { price, tokens, emoji } = thePlanDetails;
    return [
      {
        text: `${thePlan.toUpperCase()} ${emoji}- ${kFy(
          tokens
        )} tokens @ $${price}`,
        callback_data: `purchase_${thePlan}`,
      },
    ];
  });
}

function getReferralLink(id) {
  return `t.me/gpt3_tgBot?start=${enigma.encrypt(id)}`;
}

function getAccountKeyboard (langCode, translate) {
  const theKeyboard = [
    [
      {
        text: message(PURCHASE_TOKENS, langCode, translate), // TODO (translation) langCode from where
        callback_data: 'purchase_options',
      },
      {
        text: message(DONATE, langCode, translate),
        callback_data: 'donate',
      },
    ],
    [
      {
        text: `${message(TRANSLATION, langCode, translate)} ${
          translate ? '✅' : '❌'
        }`,
        callback_data: 'toggle_translation',
      },
    ],
  ];
  return theKeyboard;
};

module.exports = {
  getResponseText,
  getImage,
  enigma,
  kFy,
  getTokensFromPrice,
  wait,
  getResponseOptions,
  tomorrowMidnight,
  getPurchaseOptions,
  getReferralLink,
  getAccountKeyboard,
};
