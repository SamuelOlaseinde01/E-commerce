const UserProfile = require("../model/UserProfile");

async function userInfoCheck(req, res, next) {
  const { userId } = req.user;
  const userProfile = await UserProfile.findOne({ user: userId });

  if (
    !userProfile ||
    !userProfile.firstname ||
    !userProfile.lastname ||
    !userProfile.dateofbirth ||
    !userProfile.phonenumber ||
    !userProfile.address
  ) {
    req.profileComplete = false;
  } else {
    req.profileComplete = true;
  }

  next();
}

module.exports = userInfoCheck;
