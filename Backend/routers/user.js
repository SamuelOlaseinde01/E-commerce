const express = require("express");
const {
  getUserInfo,
  updateUserInfo,
  createUserInfo,
} = require("../controllers/userProfile");
const { login, register } = require("../controllers/auth");
const authMiddleware = require("../middleware/authMiddleware");
const { upload } = require("../config/cloudinary");
const userInfoCheck = require("../middleware/userInfoCheck");
const router = express.Router();

router
  .route("/profile")
  .get(authMiddleware, getUserInfo)
  .post(authMiddleware, userInfoCheck, upload.single("image"), createUserInfo)
  .patch(authMiddleware, upload.single("image"), updateUserInfo);
router.route("/login").post(login);
router.route("/register").post(register);

module.exports = router;
