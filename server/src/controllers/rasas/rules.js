const fs = require("fs");
const asyncHandler = require("express-async-handler");
const yaml = require("js-yaml");

const filePath = "D:/Project/Capstone1-project/chatbot/data/rules.yml";

function readRulesData() {
  const rulesData = fs.readFileSync(filePath, "utf-8");
  return yaml.load(rulesData);
}

function saveToFile(data) {
  const yamlData = yaml.dump(data);
  fs.writeFileSync(filePath, yamlData, "utf8");
}

const getAllRulesData = asyncHandler(async (req, res) => {
  const parsedRulesData = readRulesData();
  return res.status(200).json({
    success: true,
    message: "Get data on rules.yml file is successfully",
    data: parsedRulesData.rules,
  });
});

const getRule = asyncHandler(async (req, res) => {
  const parsedRulesData = readRulesData();
  const ruleName = req.query.ruleName;

  const foundRule = parsedRulesData.rules.find(
    (rule) => rule.rule === ruleName
  );

  if (!foundRule) throw new Error("Rule is not found");

  return res.status(200).json({
    success: true,
    message: "Get data on rules.yml file is successfully",
    data: foundRule,
  });
});

const addRule = asyncHandler(async (req, res) => {
  const parsedRulesData = readRulesData();
  const newRule = req.body;

  if (!newRule) throw new Error("Rule is required");

  if (parsedRulesData.rules.some((item) => item.rule === newRule.rule))
    throw new Error("Rule is existing");

    parsedRulesData.rules.push(newRule);

  saveToFile(parsedRulesData);

  return res.status(201).json({
    success: true,
    message: "Rule added successfully",
    data: newRule,
  });
});

const updateRule = asyncHandler(async (req, res) => {
  const parsedRulesData = readRulesData();
  const ruleName = req.query.ruleName;
  const updateRule = req.body;

  if (
    !parsedRulesData.rules.some(
      (rule) => rule.rule === updateRule.rule
    )
  )
    throw new Error("Rule is not find");

  const existingRuleIndex = parsedRulesData.rules.findIndex(
    (rule) => rule.rule === ruleName
  );

  if (existingRuleIndex !== -1) {
    parsedRulesData.rules[existingRuleIndex] = updateRule;

    saveToFile(parsedRulesData);

    return res.status(200).json({
      success: true,
      message: "Rule updated successfully",
      data: updateRule,
    });
  } else {
    return res.status(404).json({
      success: false,
      message: "Rule not found",
      data: null,
    });
  }
});

const deleteRule = asyncHandler(async (req, res) => {
  const parsedRulesData = readRulesData();
  const ruleName = req.query.ruleName;

  const existingRuleIndex = parsedRulesData.rules.findIndex(
    (rule) => rule.rule === ruleName
  );

  if (existingRuleIndex !== -1) {
    const deleteRule = parsedRulesData.rules.splice(
        existingRuleIndex,
      1
    )[0];

    saveToFile(parsedRulesData);

    return res.status(200).json({
      success: true,
      message: "Rule deleted successfully",
      data: deleteRule,
    });
  } else {
    return res.status(404).json({
      success: false,
      message: "Rule not found",
      data: null,
    });
  }
});

module.exports = {
  getAllRulesData,
  addRule,
  deleteRule,
  updateRule,
  getRule,
};
