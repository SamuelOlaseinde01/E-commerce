const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Please provide your email"],
      trim: true,
      minlength: 3,
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please provide your password"],
      minlength: 8,
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.comparePassword = async function (password) {
  const isMatch = await bcrypt.compare(password, this.password);
  return isMatch;
};

UserSchema.methods.createToken = function () {
  const token = jwt.sign(
    { userId: this._id, email: this.email },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );
  return token;
};

module.exports = mongoose.model("User", UserSchema);
