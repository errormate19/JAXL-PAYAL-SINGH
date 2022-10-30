const genrateRandomOTP = require("../Functions/genrateOTP");
const UserModel = require("../models/models");

module.exports.getOTP = async (req, res) => {
  try {
    const request = Object.keys(req.body);
    const validRequest = ["email"];
    const isValidRequest = request.every((requested) =>
      validRequest.includes(requested)
    );
    if (!isValidRequest) {
      res.status(400).json({ error: "Invalid Access!" });
      return;
    }
    const verifyPreviousAccout = await UserModel.findOne({
      email: req.body.email,
    });
    if (!verifyPreviousAccout) {
      const newUser = new UserModel(req.body);
      await newUser.save();
      const otp = await newUser.genrateRandomOTP();
      res.status(201).json({ newUSER: true, res: "otp is generated" });
    } else {
      const otp = await verifyPreviousAccout.genrateRandomOTP();
      res.status(201).json({ newUSER: false, res: "otp is generated" });
    }
  } catch (e) {
    res.status(400).json({ error: "bad request" });
  }
};

module.exports.verifyOTP = async (req, res) => {
  try {
    const request = Object.keys(req.body);
    const validRequest = ["email", "otp"];
    const isValidRequest = request.every((requested) =>
      validRequest.includes(requested)
    );
    if (isValidRequest) {
      const user = await UserModel.findOne({ email: req.body.email });
      if (user) {
        const time = new Date().getTime();
        if (
          user.verification.otp === req.body.otp &&
          time - user.verification.time <= 30000
        ) {
          const token = await user.genrateToken();
          console.log(token);
          res.cookie("token", token);
          res
            .status(201)
            .json({ res: true, msg: "otp verification successful" });
        } else if (user.verification.otp === req.body.otp) {
          res.status(201).json({ res: false, msg: "otp is expired" });
        } else {
          res.status(404).json({ res: false, msg: "Invalid OTP" });
        }
      } else {
        res.status(404).json({ res: true, msg: "Invalid email" });
      }
    }
  } catch (e) {
    res.status(400).json({ res: false, msg: "bad request" });
  }
};

module.exports.isActiveSession = (req, res) => {
  try {
    const user = req.user;
    res.status(201).json({ user });
  } catch (e) {
    res.status(404).json({ error: "please sign in to acceess this page!" });
  }
};

module.exports.logout = async (req, res) => {
  try {
    req.user.tokens = "";
    await req.user.save();
    res.cookie("token", "", { httpOnly: true });
    res.status(200).json({ msg: "sign out successful!", success: true });
  } catch (e) {
    res.status(500).json({ error: "error in logging out!" });
  }
};
