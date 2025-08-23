const express = require("express");
const {
  getUserInfo,
  updateUserInfo,
  createUserInfo,
} = require("../controllers/userProfile");
const { login, register } = require("../controllers/auth");
const authMiddleware = require("../middleware/authMiddleware");
const userInfoCheck = require("../middleware/userInfoCheck");
const router = express.Router();

router
  .route("/profile")
  .get(authMiddleware, getUserInfo)
  .post(authMiddleware, createUserInfo)
  .patch(authMiddleware, updateUserInfo);
router.route("/login").post(login);
router.route("/register").post(register);

module.exports = router;
