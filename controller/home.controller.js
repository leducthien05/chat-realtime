const User = require("../model/user.model");

// [GET] /
module.exports.index = async (req, res) => {
    const myID = res.locals.user._id;
    const myUser = await User.findOne({
        deleted: false,
        _id: myID
    });
    const reqFriend = myUser.requestFriends;
    const accFriend = myUser.acceptFriends;
    const idReq = reqFriend.map(item => {
        return item;
    });
    const idAcc = accFriend.map(item => {
        return item;
    });
    const user = await User.find({
        _id: {$nin: [myID, ...idReq, ...idAcc]},
        deleted: false,
        status: "active"
    });
    res.render("home/index", {
        titlePage: "Trang chủ",
        user: user
    });
}