const express = require("express");
const {
  getAllStoriesData,
  addStory,
  updateStory,
  getStory,
  deleteStory,
} = require("../controllers/rasas/stories");
const {
  getAllNLUData,
  getListIntents,
  getIntentItem,
  addIntentItem,
  deleteIntent,
  deleteExampleItem,
  updateExampleItem,
} = require("../controllers/rasas/nlu");
const {
  getAllDomainData,
  writeDomainFile,
} = require("../controllers/rasas/domain");
const { getDataForTraining } = require("../controllers/rasas/data");
const {
  getResponses,
  getListUtters,
  getUtterItem,
  addUtterItem,
  deleteUtter,
  deleteUtterItem,
  updateUtterItem,
} = require("../controllers/rasas/response");
const {
  getAllRulesData,
  addRule,
  deleteRule,
  updateRule,
  getRule,
} = require("../controllers/rasas/rules");

const router = express.Router();

// nlu
router.get("/nlu/get-nlu", getAllNLUData);
router.get("/nlu/get-list-intent", getListIntents);
router.get("/nlu/get-intent-item", getIntentItem);
router.post("/nlu/add-intent-item", addIntentItem);
router.put("/nlu/update-example-item", updateExampleItem);
router.delete("/nlu/delete-intent", deleteIntent);
router.delete("/nlu/delete-example-item", deleteExampleItem);

// rules
router.get("/rules/get-rules", getAllRulesData);
router.get("/rules/get-rule", getRule);
router.post("/rules/add-rule", addRule);
router.put("/rules/update-rule", updateRule);
router.delete("/rules/delete-rule", deleteRule);

// stories
router.get("/stories/get-stories", getAllStoriesData);
router.get("/stories/get-story", getStory);
router.post("/stories/add-story", addStory);
router.put("/stories/update-story", updateStory);
router.delete("/stories/delete-story", deleteStory);

// domain
router.get("/domain/get-domain-data", getAllDomainData);
router.post("/domain/write-domain-data", writeDomainFile);

// response
router.get("/response/get-responses", getResponses);
router.get("/response/get-list-utters", getListUtters);
router.get("/response/get-utter-item", getUtterItem);
router.post("/response/add-utter-item", addUtterItem);
router.put("/response/update-utter-item", updateUtterItem);
router.delete("/response/delete-utter-item", deleteUtterItem);
router.delete("/response/delete-utter", deleteUtter);

// data train
router.get("/data-train", getDataForTraining);

module.exports = router;
