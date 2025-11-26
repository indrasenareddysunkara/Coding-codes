// backend/controllers/userController.js
const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const Chat = require("../models/Chat");
const generateToken = require("../config/generateToken");

// GET /api/user?search=...
// Protected: list users except self, optional search by name/email
const allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.send(users);
});

// GET /api/user/doctors
// Protected: list only doctors
const allDoctors = asyncHandler(async (req, res) => {
  const doctors = await User.find({ role: "doctor" }).select("-password");
  res.json(doctors);
});

// POST /api/user
// Public: register new user
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, pic } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please enter all fields");
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
    role: role || "user",
    pic,
  });

  if (!user) {
    res.status(400);
    throw new Error("User not created");
  }

  // Add user to the global community chat
  let communityChat = await Chat.findOne({
    isGroupChat: true,
    chatName: "Community Chat",
  });

  if (!communityChat) {
    communityChat = await Chat.create({
      chatName: "Community Chat",
      isGroupChat: true,
      users: [user._id],
      groupAdmin: user._id,
    });
  } else {
    if (!communityChat.users.includes(user._id)) {
      communityChat.users.push(user._id);
      await communityChat.save();
    }
  }

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    pic: user.pic,
    token: generateToken(user._id),
  });
});

// POST /api/user/login
// Public: login
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error("Invalid Email or Password");
  }

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    pic: user.pic,
    token: generateToken(user._id),
  });
});

module.exports = { allUsers, allDoctors, registerUser, authUser };
