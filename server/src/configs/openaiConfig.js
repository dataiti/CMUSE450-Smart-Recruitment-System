const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();

const openaiConfig = new Configuration({
  apiKey: process.env.OPENAI_KEY,
});

const openai = new OpenAIApi(openaiConfig);

module.exports = openai;
