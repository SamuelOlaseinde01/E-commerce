const {
  BadRequestError,
  UnAuthorizedError,
  NotFoundError,
} = require("../errors");
const User = require("../model/User");
const UserProfile = require("../model/UserProfile");

async function register(req, res) {
  const { email, password } = req.body;
  const duplicateEmail = await User.findOne({ email: email.toLowerCase() });
  if (duplicateEmail) {
    throw new BadRequestError("Email already exists");
  }
  const user = await User.create({
    email: email.toLowerCase(),
    password: password,
  });

  const token = user.createToken();

  res.status(200).json({ token, msg: "User created successfully" });
}

async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Field cannot be empty");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new NotFoundError("Account not found, please create a new one");
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    throw new UnAuthorizedError("Password is incorrect");
  }

  const token = user.createToken();

  res.status(200).json({ token });
}
module.exports = { register, login };
