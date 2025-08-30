const {
  BadRequestError,
  NotFoundError,
  UnAuthorizedError,
} = require("../errors");
const User = require("../model/User");
const UserProfile = require("../model/UserProfile");

async function createUserInfo(req, res) {
  if (req.profileComplete) {
    return res.status(200).json({ profileComplete: req.profileComplete });
  }
  const { userId } = req.user;
  const { firstname, lastname, address, dateofbirth, phonenumber } = req.body;
  const url = req.file?.path || null;
  const public_id = req.file?.filename || null;
  if (!firstname) {
    throw new BadRequestError("Field cannot be empty", "firstname");
  }
  if (!lastname) {
    throw new BadRequestError("Field cannot be empty", "lastname");
  }
  if (!dateofbirth) {
    throw new BadRequestError("Field cannot be empty", "dateofbirth");
  }
  if (!phonenumber) {
    throw new BadRequestError("Field cannot be empty", "phonenumber");
  }
  if (!address) {
    throw new BadRequestError("Field cannot be empty", "address");
  }

  let year = dateofbirth.split("-")[0];
  let age = new Date().getFullYear() - Number(year);

  let month = dateofbirth.split("-")[1];
  let day = dateofbirth.split("-")[2];

  if (
    new Date().getMonth() + 1 < Number(month) ||
    (new Date().getMonth() + 1 === Number(month) &&
      new Date().getDate() < Number(day))
  ) {
    age--;
  }

  if (age < 13) {
    throw new UnAuthorizedError(
      "Oops! You need to be at least 13 years old to use our services.",
      "dateofbirth"
    );
  }

  console.log(req.file);

  const userInfo = await UserProfile.create({
    firstname: firstname.toLowerCase(),
    lastname: lastname.toLowerCase(),
    address,
    dateofbirth,
    phonenumber,
    user: userId,
    profilePicture: { url, public_id },
  });

  res.status(200).json({ userInfo });
}

async function getUserInfo(req, res) {
  const { userId } = req.user;
  const userInfo = await UserProfile.findOne({ user: userId }).populate(
    "user",
    "-password"
  );
  if (!userInfo) {
    return res.status(200).json({ profileComplete: req.profileComplete });
  }
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

    if (existingUser.email === email) {
      throw new BadRequestError("Cannot overwrite same data", "email");
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

  const userProfile = await UserProfile.findOne({ user: userId });
  if (!userProfile) throw new NotFoundError("User not found");

  const isSame = Object.keys(profileUpdates).every(
    (key) => userProfile[key] === profileUpdates[key]
  );

  if (isSame) {
    throw new BadRequestError(
      "Cannot overwrite same data",
      Object.keys(profileUpdates)[0]
    );
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
