const User = require("../model/user.model");

module.exports.info = async (req, res, next) => {
    if (req.cookies.tokenUser) {
        const user = await User.findOne({
            deleted: false,
            tokenUser: req.cookies.tokenUser
        }).select("-password");
        if (!user) {
            res.redirect("/user/login");
        } else {
            res.locals.Myuser = user;
        }
    }
    next();

}