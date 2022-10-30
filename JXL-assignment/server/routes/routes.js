const { Router } = require("express");
const verifyUserLogin = require("../authentication/middleware");
const {
  getOTP,
  verifyOTP,
  isActiveSession,
  logout,
} = require("../controller/controller");

const routes = Router();

routes.post("/genrate-otp", getOTP);
routes.post("/verify-otp", verifyOTP);
routes.post("/valid-user", verifyUserLogin, isActiveSession);
routes.post("/logout-user", verifyUserLogin, logout);

module.exports = routes;
