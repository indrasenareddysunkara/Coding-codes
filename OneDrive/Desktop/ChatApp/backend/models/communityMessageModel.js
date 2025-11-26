const mongoose = require("mongoose");

const communityMessageSchema = mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, trim: true, required: true },
  },
  { timestamps: true }
);

const CommunityMessage = mongoose.model("CommunityMessage", communityMessageSchema);
module.exports = CommunityMessage;
