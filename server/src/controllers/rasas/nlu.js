const fs = require("fs");
const asyncHandler = require("express-async-handler");
const yaml = require("js-yaml");
require("dotenv").config();

const filePath = `${process.env.RASA_DATA_PATH}/data/nlu.yml`;

function readNLUData() {
  const NLUData = fs.readFileSync(filePath, "utf-8");
  return yaml.load(NLUData);
}

function saveToFile(data) {
  const yamlData = yaml.dump(data);
  fs.writeFileSync(filePath, yamlData, "utf8");
}

const getAllNLUData = asyncHandler(async (req, res) => {
  const search = req.query.search ? req.query.search : "";

  const parsedNLUData = readNLUData();

  const transformedNLU = parsedNLUData.nlu
    .map((item) => {
      const intent = item.intent;
      const examples = item.examples
        .split("\n")
        .map((example) => example.trim())
        .filter(Boolean);

      return examples.map((example) => ({ example, intent }));
    })
    .flat();

  return res.status(200).json({
    success: true,
    message: "Get data on stories.yml file is successfully",
    data: transformedNLU,
  });
});

const getListIntents = asyncHandler(async (req, res) => {
  const parsedNLUData = readNLUData();
  const listIntents = parsedNLUData.nlu.map((intent) => intent.intent);

  if (!listIntents) throw new Error("intent is not found");

  return res.status(200).json({
    success: true,
    message: "Get list intents are successfully",
    data: listIntents,
  });
});

const getIntentItem = asyncHandler(async (req, res) => {
  const intentName = req.query.intentName;

  if (!intentName) throw new Error("Intent is required");

  const parsedNLUData = readNLUData();

  const findIntent = parsedNLUData.nlu.find(
    (intent) => intent.intent === intentName
  );

  if (!findIntent) throw new Error("intent is not found");

  return res.status(200).json({
    success: true,
    message: "Get list intents are successfully",
    data: findIntent,
  });
});

const addIntentItem = asyncHandler(async (req, res) => {
  const { intentName, exampleItem } = req.body;

  if (!intentName) throw new Error("IntentName is required");

  const parsedNLUData = readNLUData();

  const findIntent = parsedNLUData.nlu.find(
    (intent) => intent.intent === intentName
  );

  if (!findIntent) {
    const newIntent = { intent: intentName, examples: `- ${exampleItem}\n` };
    parsedNLUData.nlu.push(newIntent);

    saveToFile(parsedNLUData);

    return res.status(200).json({
      success: true,
      message: "Get list intents are successfully",
      data: newIntent,
    });
  } else {
    if (findIntent.examples) {
      findIntent.examples += `- ${exampleItem}\n`;
    } else {
      findIntent.examples = `- ${exampleItem}\n`;
    }

    saveToFile(parsedNLUData);

    return res.status(200).json({
      success: true,
      message: "Get list intents are successfully",
      data: findIntent,
    });
  }
});

const updateExampleItem = asyncHandler(async (req, res) => {
  const { intentName, exampleIndex } = req.query;
  const { exampleItem } = req.body;

  if (!intentName || !exampleIndex) {
    return res.status(400).json({
      success: false,
      message: "intentName or exampleIndex is required",
    });
  }

  const parsedNLUData = readNLUData();

  const findIntent = parsedNLUData.nlu.find(
    (intent) => intent.intent === intentName
  );

  if (findIntent) {
  }

  return res.status(404).json({
    success: false,
    message: "Intent not found",
    data: null,
  });
});

const deleteIntent = asyncHandler(async (req, res) => {
  const { intentName } = req.query;

  if (!intentName) throw new Error("intentName is required");

  const parsedNLUData = readNLUData();

  const intentIndex = parsedNLUData.nlu.findIndex(
    (intent) => intent.intent === intentName
  );

  if (!intentIndex !== -1) {
    const deletedStory = parsedNLUData.nlu.splice(intentIndex, 1)[0];

    saveToFile(parsedNLUData);

    return res.status(200).json({
      success: true,
      message: "Delete intent is successfully",
      data: deletedStory,
    });
  }

  return res.status(200).json({
    success: true,
    message: "Intent is not found",
  });
});

const deleteExampleItem = asyncHandler(async (req, res) => {
  const { intentName, exampleItem } = req.query;

  if (!intentName) throw new Error("intentName is required");

  const parsedNLUData = readNLUData();

  const findIntent = parsedNLUData.nlu.find(
    (intent) => intent.intent === intentName
  );

  if (findIntent) {
    findIntent.examples = findIntent.examples
      .split("\n")
      .map((item) => item.trim())
      .filter((item) => item !== `${exampleItem}`)
      .join("\n");

    saveToFile(parsedNLUData);

    return res.status(200).json({
      success: true,
      message: "Intent is not found",
      data: findIntent,
    });
  }

  return res.status(200).json({
    success: true,
    message: "Intent is not found",
    data: findIntent,
  });
});

module.exports = {
  readNLUData,
  getAllNLUData,
  getListIntents,
  getIntentItem,
  addIntentItem,
  updateExampleItem,
  deleteIntent,
  deleteExampleItem,
};
