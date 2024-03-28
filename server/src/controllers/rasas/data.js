const fs = require("fs");
const asyncHandler = require("express-async-handler");
const yaml = require("js-yaml");
require("dotenv").config();

function readFileData(filePath) {
  const NLUData = fs.readFileSync(filePath, "utf-8");
  return NLUData;
}

const getDataForTraining = asyncHandler(async (req, res) => {
  const NLUData = readFileData(`${process.env.RASA_DATA_PATH}/data/nlu.yml`);
  const rulesData = readFileData(
    `${process.env.RASA_DATA_PATH}/data/rules.yml`
  );
  const storiesData = readFileData(
    `${process.env.RASA_DATA_PATH}/data/stories.yml`
  );
  const domainData = readFileData(`${process.env.RASA_DATA_PATH}/domain.yml`);

  const combinedText = `${NLUData}\n${rulesData}\n${storiesData}\n${domainData}`;

  return res.status(200).json({
    success: true,
    message: "Get data on domain.yml file is successfully",
    data: combinedText,
  });
});

module.exports = { getDataForTraining };
