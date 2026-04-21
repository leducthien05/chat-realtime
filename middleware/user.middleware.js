const User = require("../model/user.model");

module.exports.user = async (req, res, next) => {
    if (!req.cookies.tokenUser) {
        res.redirect("/user/login");
        return;
    }else{
        const user = await User.findOne({
            deleted: false,
            tokenUser: req.cookies.tokenUser
        }).select("-password");
        if (!user){
            res.redirect("/user/login");
        }else{
            res.locals.user = user;
            next();
        }
        
    }
    
}