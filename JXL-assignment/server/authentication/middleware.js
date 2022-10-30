const jwt = require("jsonwebtoken");
const UserModel = require("../models/models");

const verifyUserLogin = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    const decode = jwt.verify(token, "secretKey");
    const user = await UserModel.findOne({
      _id: decode._id,
      token: token,
    });
    if (!user) throw new Error("please authenticate");
    req.user = user;
    req.token = token;
    next();
  } catch (e) {
    res.status(404).json({ error: "please sign in to access this page" });
  }
};

module.exports = verifyUserLogin;
