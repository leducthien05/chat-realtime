const User = require("../model/user.model");

const searchHelper = require("../helper/search");

// [GET] /
module.exports.index = async (req, res) => {
    const myID = res.locals.user._id;
    const myUser = await User.findOne({
        deleted: false,
        _id: myID
    });
    const reqFriend = myUser.requestFriends;
    const accFriend = myUser.acceptFriends;
    const listFriend = myUser.listFriends.map(item => item.friend_id);
    const idReq = reqFriend.map(item => {
        return item;
    });
    const idAcc = accFriend.map(item => {
        return item;
    });
    const find = {
        _id: {$nin: [myID, ...idReq, ...idAcc, ...listFriend]},
        deleted: false,
        status: "active"
    }
    const search = searchHelper.search(req.query);
    if (search.regex){
        find.userName = search.regex;
    }
    const user = await User.find(find);
    res.render("home/index", {
        titlePage: "Trang chủ",
        user: user
    });
}