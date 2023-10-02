const express = require("express");
const {
  candidateById,
  getCandidateDetail,
  registerCandidate,
  editCandidate,
  deleteCandidate,
  getListOfCandidateForEmployer,
  getListOfCandidateForAdmin,
} = require("../controllers/candidate");
const { userById } = require("../controllers/user");

const router = express.Router();

router.get("/list-candidates/admin/:userId", getListOfCandidateForAdmin);
router.get("/get-user-detail/:candidateId", getCandidateDetail);
router.post("/register-candidate/:userId/:candidateId", registerCandidate);
router.put("/edit-candidate/:candidateId", editCandidate);
router.delete("/delete-candidate/:candidateId", deleteCandidate);

router.param("userId", userById);
router.param("candidateId", candidateById);

module.exports = router;
