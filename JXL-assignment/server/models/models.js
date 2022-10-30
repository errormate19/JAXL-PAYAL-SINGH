const mongoose = require("mongoose");
const { isEmail } = require("validator");
const genrateOTP = require("../Functions/genrateOTP");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    trim: true,
    lowercase: true,
    required: [true, "email is required"],
    unique: true,
    validate(val) {
      if (!isEmail) throw new Error("invalid email");
    },
  },
  verification: {
    otp: {
      type: String,
      trim: true,
      validate(val) {
        if (val.length !== 6 || isNaN(val)) throw new Error("Invalid OTP");
      },
    },
    time: {
      type: Date,
    },
  },
  token: {
    type: String,
    trim: true,
  },
});

UserSchema.methods.genrateRandomOTP = async function () {
  const user = this;
  user.verification = genrateOTP();
  await user.save();
  console.log(user.verification.otp);
  return user.verification.otp;
};

UserSchema.methods.genrateToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, "secretKey");
  user.token = token;
  await user.save();
  return token;
};

const UserModel = mongoose.model("user", UserSchema);

module.exports = UserModel;
