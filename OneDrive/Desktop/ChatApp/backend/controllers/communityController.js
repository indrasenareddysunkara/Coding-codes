const asyncHandler = require("express-async-handler");
const CommunityMessage = require("../models/communityMessageModel");

// GET /api/community/messages
// @access Protected
const getCommunityMessages = asyncHandler(async (req, res) => {
  const messages = await CommunityMessage.find({})
    .sort({ createdAt: 1 })
    .limit(200)
    .populate("sender", "name email pic role");
  res.json(messages);
});

// POST /api/community/messages
// body: { content }
// @access Protected
const sendCommunityMessage = asyncHandler(async (req, res) => {
  const { content } = req.body;

  if (!content) {
    res.status(400);
    throw new Error("Content is required");
  }

  let message = await CommunityMessage.create({
    sender: req.user._id,
    content,
  });

  message = await message.populate("sender", "name email pic role");
  res.status(201).json(message);
});

module.exports = { getCommunityMessages, sendCommunityMessage };
