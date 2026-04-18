const User = require("../model/user.model");

const passwordHelper = require("../helper/password");
const crypto = require("crypto");

// [GET] /user/login
module.exports.login = async (req, res)=>{
    res.render("user/login", {
        titlePage: "Đăng nhập"
    });
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
    res.redirect("/");
}