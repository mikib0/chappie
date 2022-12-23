const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function getResponseText(prompt) {
  const completion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `${prompt}`,
    temperature: 1,
    max_tokens: 1024,
  });

  const response = completion.data.choices[0].text;
  return response;
}

module.exports = {
  getResponseText
}