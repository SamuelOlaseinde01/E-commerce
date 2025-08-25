const {
  BadRequestError,
  UnAuthorizedError,
  NotFoundError,
} = require("../errors");
const User = require("../model/User");

async function register(req, res) {
  const { email, password } = req.body;
  const duplicateEmail = await User.findOne({ email: email.toLowerCase() });
  if (duplicateEmail) {
    throw new BadRequestError("Email already exists", "email");
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
  if (!email) {
    throw new BadRequestError("Field cannot be empty", "email");
  }

  if (!password) {
    throw new BadRequestError("Field cannot be empty", "password");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new NotFoundError(
      "Account not found, please create a new one",
      "email"
    );
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    throw new UnAuthorizedError("Password is incorrect", "password");
  }

  const token = user.createToken();

  res.status(200).json({ token });
}
module.exports = { register, login };
