const express = require("express");
const {
  candidateById,
  getCandidateDetail,
  registerCandidate,
  editCandidate,
  deleteCandidate,
} = require("../controllers/candidate");
const { userById } = require("../controllers/user");

const router = express.Router();

router.get("/get-user-detail/:userId/:candidateId", getCandidateDetail);
router.post("/register-candidate/:userId", registerCandidate);
router.put("/edit-candidate/:userId/:candidateId", editCandidate);
router.delete("/delete-candidate/:userId/:candidateId", deleteCandidate);

router.param("userId", userById);
router.param("candidateId", candidateById);

module.exports = router;
