const User = require("../model/user.model");
const OTP = require("../model/otp.model");

const passwordHelper = require("../helper/password");
const sendMail = require("../helper/sendMail");
const generalOTP = require("../helper/generalOTP");
const crypto = require("crypto");

// [GET] /user/login
module.exports.login = async (req, res)=>{
    res.render("user/login", {
        titlePage: "Đăng nhập"
    });
}
// [POST] /user/login
module.exports.loginPost = async (req, res)=>{
    console.log(req.body)
    const user = await User.findOne({
        deleted: false,
        email: req.body.email
    });
    if(!user){
        req.flash("error", "Email không tồn tại1");
        res.redirect(req.get("referer") || "/");
        return;
    }
    const isPassword = await passwordHelper.comparePassword(req.body.password, user.password);
    if(isPassword){
        res.cookie("tokenUser", user.tokenUser);
    }
    res.redirect("/home");
}
// [GET] /user/register
module.exports.register = async (req, res)=>{
    res.render("user/register", {
        titlePage: "Đăng ký"
    });
}
// [POST] /user/register
module.exports.registerPost = async (req, res)=>{
    const existEmail = await User.findOne({
        deleted: false,
        email: req.body.email
    });
    if(existEmail){
        req.flash("error", "Email đã tồn tại");
        res.redirect(req.get("referer") || "/");
        return;
    }
    const password = await passwordHelper.hashPassword(req.body.password);
    const token = crypto.randomBytes(32).toString("hex");
    const user = new User({
        email: req.body.email,
        password: password,
        userName: req.body.userName,
        tokenUser: token
    });
    await user.save();
    res.cookie("tokenUser", user.tokenUser);
    res.redirect("/home");
}
// [GET] /user/forgot-password
module.exports.forgot = async (req, res)=>{
    res.render("user/forgot-password", {
        titlePage: "Quên mật khẩu"
    });
}
// [POST] /user/forgot-password
module.exports.forgotPost = async (req, res)=>{
    const email = req.body.email;
    const user = await User.findOne({
        deleted: false,
        email: email
    });
    if(!user){
        req.flash("error", "Email không tồn tại");
        res.redirect(req.get("referer") || "/");
        return;
    }
    //Tạo mã otp
    const otp = generalOTP.generateRandomNumber(6);
    const record = new OTP({
        email: email,
        otp: otp,
        expireAt: Date.now()
    });
    await record.save();
    // Gửi mail
    const subject = "Mã xác nhận email";
    html = `
        Mã OTP để lấy lại mật khẩu là <b>${otp}</b>. Sẽ hết hạn sau 3 phút
    `;
    sendMail.sendMailer(email, subject, html);
    res.redirect(`/user/reset-password/${req.body.email}`);
}
// [POST] /user/getOtp
module.exports.resendOtp = async (req, res)=>{
    const email = req.body.email;
    //Tạo mã otp
    const otp = generalOTP.generateRandomNumber(6);
    const record = new OTP({
        email: req.body.email,
        otp: otp,
        expireAt: Date.now()
    });
    await record.save();
    // Gửi mail
    const subject = "Mã xác nhận email";
    html = `
        Mã OTP để lấy lại mật khẩu là <b>${otp}</b>. Sẽ hết hạn sau 3 phút
    `;
    sendMail.sendMailer(email, subject, html);
    res.redirect(req.get("referer") || "/");

}
// [GET] /user/getOtp/email
module.exports.getOtp = async (req, res)=>{
    const email = req.params.email;
    res.render("user/getOtp", {
        titlePage: "Nhập mã OTP",
        email: email
    });
}
// [POST] /user/getOtp
module.exports.getOtpPost = async (req, res)=>{
    const otp = await OTP.findOne({
        email: req.body.email,
        otp: req.body.otp
    });
    if(!otp){
        req.flash("error", "Mã OTP không đúng hoặc đã hết hạn");
        res.redirect(req.get("referer") || "/");
        return;
    }
    res.redirect(`/user/reset-password/${req.body.email}`);
}
// [GET] /user/reset-password/:email
module.exports.resetPassword = async (req, res)=>{
    const email = req.params.email
    res.render(`user/reset-password`, {
        titlePage: "Đặt lại mật khẩu",
        email: email
    });
}
// [POST] /user/reset-password
module.exports.resetPasswordPost = async (req, res)=>{
    const email = req.body.email;
    const password = await passwordHelper.hashPassword(req.body.password);
    await User.updateOne({
        email: email,
        deleted: false
    }, {
        $set: {
            password: password
        }
    });
    const user = await User.findOne({
        email: email,
        deleted: false
    }).select("-password");
    res.cookie("tokenUser", user.tokenUser);
    res.redirect("/home")
}
// [GET] /user/logout
module.exports.logout = async (req, res)=>{
    res.clearCookie("tokenUser");
    res.redirect("/user/login");
}