const { BadRequestError, NotFoundError } = require("../errors");
const User = require("../model/User");
const UserProfile = require("../model/UserProfile");

async function createUserInfo(req, res) {
  const { userId } = req.user;
  const { firstname, lastname, address, dateOfBirth, phoneNumber } = req.body;
  const { path: url, filename: public_id } = req.file;
  if (!firstname || !lastname || !dateOfBirth || !phoneNumber || !address) {
    throw new BadRequestError("Field cannot be empty");
  }
  const userInfo = await UserProfile.create({
    firstname,
    lastname,
    address,
    dateofbirth: dateOfBirth,
    phonenumber: phoneNumber,
    user: userId,
    profilePicture: { url, public_id },
  });

  res.status(200).json({ userInfo });
}

async function getUserInfo(req, res) {
  const { userId } = req.user;
  const userInfo = await UserProfile.findOne({ user: userId }).populate("user");
  res.status(200).json({ userInfo });
}

async function updateUserInfo(req, res) {
  const { userId } = req.user;
  const { email, password, ...profileUpdates } = req.body;

  if (email) {
    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser._id.toString() !== userId) {
      throw new BadRequestError("Email already in use");
    }
    const user = await User.findOneAndUpdate(
      { _id: userId },
      { email: email.toLowerCase() },
      { runValidators: true, new: true }
    );
    if (!user) throw new NotFoundError("User not found");
    return res.status(200).json({ user });
  }

  if (password) {
    const user = await User.findById(userId);
    if (!user) throw new NotFoundError("User not found");

    user.password = password;
    await user.save();
    return res.status(200).json({ user });
  }

  if (req.file) {
    const userProfile = await UserProfile.findOne({ user: userId });
    if (!userProfile) throw new NotFoundError("User not found");

    if (userProfile.profilePicture && userProfile.profilePicture.public_id) {
      await cloudinary.uploader.destroy(userProfile.profilePicture.public_id);
    }

    userProfile.profilePicture = {
      url: req.file.path,
      public_id: req.file.filename,
    };
    await userProfile.save();

    return res.status(200).json({ userProfile });
  }

  const userInfo = await UserProfile.findOneAndUpdate(
    { user: userId },
    profileUpdates,
    { runValidators: true, new: true }
  );
  if (!userInfo) throw new NotFoundError("User not found");

  return res.status(200).json({ userInfo });
}

module.exports = {
  getUserInfo,
  updateUserInfo,
  createUserInfo,
};
