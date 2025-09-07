const express = require("express");
const passport = require("passport");
const router = express.Router();

// Step 1: Kick off Google OAuth flow
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Step 2: Handle callback from Google
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/" }),
  (req, res) => {
    // req.user is the user from the Google strategy
    const token = req.user.createToken();

    // Option 1: Send token as JSON (for APIs / SPAs)
    res.json({
      token,
      user: { id: req.user._id, email: req.user.email },
    });

    // Option 2: Redirect frontend with token in query
    // res.redirect(`http://localhost:3000/login/success?token=${token}`);
  }
);

module.exports = router;
