const fs = require("fs");
const asyncHandler = require("express-async-handler");
const yaml = require("js-yaml");

<<<<<<< HEAD
const filePath = "D:/Project/Capstone1-project/chatbot/data/rules.yml";
=======
const filePath = `${process.env.RASA_DATA_PATH}/data/rules.yml`;
>>>>>>> c0b77fc652333b77d220c7f0f07a50307ff9f19f

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

<<<<<<< HEAD
  if (!foundRule) throw new Error("Rule is not found");

  return res.status(200).json({
    success: true,
    message: "Get data on rules.yml file is successfully",
=======
  if (!foundRule) throw new Error("Story is not found");

  return res.status(200).json({
    success: true,
    message: "Get data on stories.yml file is successfully",
>>>>>>> c0b77fc652333b77d220c7f0f07a50307ff9f19f
    data: foundRule,
  });
});

const addRule = asyncHandler(async (req, res) => {
  const parsedRulesData = readRulesData();
  const newRule = req.body;

  if (!newRule) throw new Error("Rule is required");

  if (parsedRulesData.rules.some((item) => item.rule === newRule.rule))
    throw new Error("Rule is existing");

<<<<<<< HEAD
    parsedRulesData.rules.push(newRule);
=======
  parsedRulesData.rules.push(newRule);
>>>>>>> c0b77fc652333b77d220c7f0f07a50307ff9f19f

  saveToFile(parsedRulesData);

  return res.status(201).json({
    success: true,
<<<<<<< HEAD
    message: "Rule added successfully",
=======
    message: "Story added successfully",
>>>>>>> c0b77fc652333b77d220c7f0f07a50307ff9f19f
    data: newRule,
  });
});

const updateRule = asyncHandler(async (req, res) => {
  const parsedRulesData = readRulesData();
  const ruleName = req.query.ruleName;
<<<<<<< HEAD
  const updateRule = req.body;

  if (
    !parsedRulesData.rules.some(
      (rule) => rule.rule === updateRule.rule
    )
  )
    throw new Error("Rule is not find");
=======
  const updatedRule = req.body;

  if (!parsedRulesData.rules.some((rule) => rule.rule === updatedRule.rule))
    throw new Error("rule is not find");
>>>>>>> c0b77fc652333b77d220c7f0f07a50307ff9f19f

  const existingRuleIndex = parsedRulesData.rules.findIndex(
    (rule) => rule.rule === ruleName
  );

  if (existingRuleIndex !== -1) {
<<<<<<< HEAD
    parsedRulesData.rules[existingRuleIndex] = updateRule;
=======
    parsedRulesData.rules[existingRuleIndex] = updatedRule;
>>>>>>> c0b77fc652333b77d220c7f0f07a50307ff9f19f

    saveToFile(parsedRulesData);

    return res.status(200).json({
      success: true,
<<<<<<< HEAD
      message: "Rule updated successfully",
      data: updateRule,
=======
      message: "rule updated successfully",
      data: updatedRule,
>>>>>>> c0b77fc652333b77d220c7f0f07a50307ff9f19f
    });
  } else {
    return res.status(404).json({
      success: false,
<<<<<<< HEAD
      message: "Rule not found",
=======
      message: "rule not found",
>>>>>>> c0b77fc652333b77d220c7f0f07a50307ff9f19f
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
<<<<<<< HEAD
    const deleteRule = parsedRulesData.rules.splice(
        existingRuleIndex,
      1
    )[0];
=======
    const deletedRule = parsedRulesData.rules.splice(existingRuleIndex, 1)[0];
>>>>>>> c0b77fc652333b77d220c7f0f07a50307ff9f19f

    saveToFile(parsedRulesData);

    return res.status(200).json({
      success: true,
<<<<<<< HEAD
      message: "Rule deleted successfully",
      data: deleteRule,
=======
      message: "Story deleted successfully",
      data: deletedRule,
>>>>>>> c0b77fc652333b77d220c7f0f07a50307ff9f19f
    });
  } else {
    return res.status(404).json({
      success: false,
<<<<<<< HEAD
      message: "Rule not found",
=======
      message: "Story not found",
>>>>>>> c0b77fc652333b77d220c7f0f07a50307ff9f19f
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
