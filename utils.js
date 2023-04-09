const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function getResponseText(context, input) {
  // {
  //   role: 'system',
  //   content:
  //     'Your name is chappie, a helpful assistant.',
  // },
  const messages = context;
  messages.push({
    role: 'user',
    content: input,
  });

  // TODO may be i should call wait() here instead
  const completion = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages,
    temperature: 0.8, // TODO get value from env
    max_tokens: 1024, // TODO get value from env
  });


  const responseText = completion.data.choices[0].message.content;
  return {
    responseText,
    finishReason: completion.data.choices[0].finish_reason,
    totalTokens: completion.data.usage.total_tokens,
  };
}

module.exports = {
  getResponseText
}
