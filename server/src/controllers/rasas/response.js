const fs = require("fs");
const asyncHandler = require("express-async-handler");
const yaml = require("js-yaml");
require("dotenv").config();

const filePath = `${process.env.RASA_DATA_PATH}/domain.yml`;

function readResponseData() {
  const domainData = fs.readFileSync(filePath, "utf-8");
  return yaml.load(domainData);
}

function saveToFile(data) {
  const yamlData = yaml.dump(data);
  fs.writeFileSync(filePath, yamlData, "utf8");
}

const getResponses = asyncHandler(async (req, res) => {
  const parsedReponses = readResponseData();

  return res.status(200).json({
    sucess: true,
    message: "Get responses data is successfully",
    data: parsedReponses.responses,
  });
});

const getListUtters = asyncHandler(async (req, res) => {
  let parsedReponses = readResponseData();

  parsedReponses = Object.keys(parsedReponses.responses).map((utterName) => ({
    utterName,
    utterTexts: parsedReponses.responses[utterName],
  }));

  return res.status(200).json({
    sucess: true,
    message: "Get responses data is successfully",
    data: parsedReponses,
  });
});

const getUtterItem = asyncHandler(async (req, res) => {
  const { utterName } = req.query;

  if (!utterName) throw new Error("utterName is required");

  const parsedReponses = readResponseData();

  const findUtter = parsedReponses.responses[utterName];

  return res.status(200).json({
    sucess: true,
    message: "Get responses data is successfully",
    data: { utterName, utterTexts: findUtter },
  });
});

const addUtterItem = asyncHandler(async (req, res) => {
  const { utterName, textContent } = req.body;

  if (!utterName || !textContent)
    throw new Error("utterName or texItem is required");

  const parsedReponses = readResponseData();

  if (parsedReponses.responses.hasOwnProperty(utterName)) {
    if (parsedReponses.responses[utterName] !== null) {
      parsedReponses.responses[utterName].push({ text: textContent });
    } else {
      parsedReponses.responses[utterName] = [];
      parsedReponses.responses[utterName].push({ text: textContent });
    }
  } else {
    parsedReponses.responses[utterName] = [{ text: textContent }];
  }

  saveToFile(parsedReponses);

  return res.status(200).json({
    success: true,
    message: "Add utter item is successfully",
    data: { utterName, textContent },
  });
});

const deleteUtter = asyncHandler(async (req, res) => {
  const { utterName } = req.query;

  if (!utterName) throw new Error("utterName is required");

  const parsedReponses = readResponseData();

  if (parsedReponses.responses.hasOwnProperty(utterName)) {
    delete parsedReponses.responses[utterName];
  } else {
    throw new Error("utterName is not found");
  }

  saveToFile(parsedReponses);

  return res.status(200).json({
    success: true,
    message: "Add utter item is successfully",
    data: { utterName },
  });
});

const deleteUtterItem = asyncHandler(async (req, res) => {
  const { utterName, textContent } = req.query;

  if (!utterName || !textContent)
    throw new Error("utterName and textContent are required");

  const parsedResponses = readResponseData();

  if (!parsedResponses.responses.hasOwnProperty(utterName))
    throw new Error("utterName not found");

  const utterItem = parsedResponses.responses[utterName];

  const newTexts = utterItem.filter((item) => item.text !== textContent);

  if (newTexts && newTexts.length > 0) {
    parsedResponses.responses[utterName] = newTexts;
  } else {
    parsedResponses.responses[utterName] = utterItem;
  }

  saveToFile(parsedResponses);

  return res.status(200).json({
    success: true,
    message: "Delete utter text successfully",
    data: { utterName, textContent },
  });
});

const updateUtterItem = asyncHandler(async (req, res) => {
  const { utterName, oldText, newText } = req.body;

  if (!utterName || !oldText || !newText)
    throw new Error("utterName, oldText, and newText are required");

  const parsedResponses = readResponseData();

  if (!parsedResponses.responses.hasOwnProperty(utterName))
    throw new Error("utterName not found");

  const utterItem = parsedResponses.responses[utterName];

  const updatedTexts = utterItem.map((item) =>
    item.text === oldText ? { text: newText } : item
  );

  parsedResponses.responses[utterName] = updatedTexts;

  saveToFile(parsedResponses);

  return res.status(200).json({
    success: true,
    message: "Update utter text successfully",
    data: { utterName, oldText, newText },
  });
});

module.exports = {
  getResponses,
  getListUtters,
  getUtterItem,
  addUtterItem,
  deleteUtter,
  deleteUtterItem,
  updateUtterItem,
};
