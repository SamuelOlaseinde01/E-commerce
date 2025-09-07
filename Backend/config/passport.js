// config/passport.js
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../model/User");

async function googleAuthCallback(accessToken, refreshToken, profile, done) {
  try {
    // Look for user by googleId or email
    let user = await User.findOne({
      $or: [{ googleId: profile.id }, { email: profile.emails[0].value }],
    });

    if (!user) {
      // If no user exists, create a new one
      user = await User.create({
        email: profile.emails[0].value,
        googleId: profile.id,
        provider: "google",
      });
    }

    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}

function configurePassport(passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/callback",
      },
      googleAuthCallback
    )
  );
}

module.exports = configurePassport;
