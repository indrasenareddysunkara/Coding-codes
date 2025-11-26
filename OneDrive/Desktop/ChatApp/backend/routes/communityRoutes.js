const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  getCommunityMessages,
  sendCommunityMessage,
} = require("../controllers/communityController");

const router = express.Router();

router.route("/messages")
  .get(protect, getCommunityMessages)
  .post(protect, sendCommunityMessage);

module.exports = router;
