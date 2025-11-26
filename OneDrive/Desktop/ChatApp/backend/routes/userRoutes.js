// backend/routes/userRoutes.js
const express = require("express");
const {
  registerUser,
  authUser,
  allUsers,
  allDoctors,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").post(registerUser).get(protect, allUsers);
router.post("/login", authUser);
router.get("/doctors", protect, allDoctors);

module.exports = router;
