const asyncHandler = require("express-async-handler");
const openai = require("../configs/openaiConfig");

const chatbot = asyncHandler(async (req, res) => {
  const { prompt } = req.body;

  const answer = await openai.createCompletion({
    model: "gpt-3.5-turbo",
    prompt: prompt,
    temperature: 0,
    max_tokens: 3000,
  });

  const text = answer.data.choices[0].text;

  console.log(answer.data);

  return res.status(200).json({
    success: true,
    message: "Create answer successfully",
    data: text,
  });
});

module.exports = { chatbot };
