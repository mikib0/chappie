const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function getResponseText(content) {
  const completion = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [{
      role: 'user', content
    }],
    temperature: 0.8, // TODO get value from env
    max_tokens: 1024, // TODO get value from env
  });

  const response = completion.data.choices[0].message.content;
  return response;
}

module.exports = {
  getResponseText
}
