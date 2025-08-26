const mongoose = require("mongoose");

const UserProfileSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      match: [/^[a-zA-Z\s'-]+$/, "Invalid first name"],
      minlength: 3,
      maxlength: 50,
      trim: true,
    },
    lastname: {
      type: String,
      match: [/^[a-zA-Z\s'-]+$/, "Invalid last name"],
      trim: true,
      minlength: 3,
      maxlength: 50,
    },
    address: {
      type: String,
      trim: true,
      minlength: 5,
    },
    dateofbirth: {
      type: String,
      required: [true, "Please provide your date of birth"],
      trim: true,
      match: [
        /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,
        "Invalid date of birth provided",
      ],
      minlength: 10,
      maxlength: 10,
    },
    phonenumber: {
      type: String,
      required: [true, "Please provide your phone number"],
      match: [/^\+\d{1,3}(?:\s\d{3,4}){2,4}$/, "Invalid phone number provided"],
      trim: true,
    },
    profilePicture: {
      url: { type: String, trim: true },
      public_id: { type: String, trim: true },
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User profile", UserProfileSchema);
