const express = require("express");
const router = express.Router();

const validator = require("../validator/auth");
const controller = require("../controller/user.controller");

router.get("/login", controller.login);
router.post("/login", validator.login, controller.loginPost);
router.get("/register", controller.register);
router.post("/register", validator.register, controller.registerPost);
router.get("/forgot-password", validator.forgot, controller.forgot);
router.post("/forgot-password", controller.forgotPost);
router.get("/getOtp/:email", validator.otp, controller.getOtp);
router.post("/resend-otp", controller.resendOtp);
router.post("/getOtp", controller.getOtpPost);
router.get("/reset-password/:email", controller.resetPassword);
router.post("/reset-password", validator.resetPassword, controller.resetPasswordPost);
router.get("/logout", controller.logout);

module.exports = router;