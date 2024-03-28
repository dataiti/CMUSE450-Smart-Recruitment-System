const fs = require("fs");
const asyncHandler = require("express-async-handler");
const yaml = require("js-yaml");
require("dotenv").config();

const filePath = `${process.env.RASA_DATA_PATH}/domain.yml`;

function readDomainData() {
  const NLUData = fs.readFileSync(filePath, "utf-8");
  return yaml.load(NLUData);
}

function saveToFile(data) {
  const yamlData = yaml.dump(data);
  fs.writeFileSync(filePath, yamlData, "utf8");
}

const getAllDomainData = asyncHandler(async (req, res) => {
  const parsedDomainData = readDomainData();

  return res.status(200).json({
    success: true,
    message: "Get data on domain.yml file is successfully",
    data: parsedDomainData,
  });
});

const writeDomainFile = asyncHandler(async (req, res) => {
  console.log(req.body);

  saveToFile(req.body);

  return res.status(200).json({
    success: true,
    message: "Write data on domain.yml file is successfully",
    data: domainData,
  });
});

module.exports = { getAllDomainData, writeDomainFile };
