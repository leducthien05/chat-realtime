const User = require("../model/user.model");

const socketFriend = require("../socket/friend.socket");

// [GET] /friend/no-friend
module.exports.index = async (req, res) => {
    // Socket friend
    socketFriend.friend(req, res);
    // End Socket friend

    const myID = res.locals.user._id;
    console.log(myID);
    const myUser = await User.findOne({
        deleted: false,
        _id: myID
    });
    const reqFriend = myUser.requestFriends;
    const accFriend = myUser.acceptFriends;
    const unsuggestFriend = myUser.listCancelFriends;
    const idReq = reqFriend.map(item =>{
        return item;
    });
    const idAcc = accFriend.map(item =>{
        return item;
    });
    const idUnsuggest = unsuggestFriend.map(item =>{
        return item;
    });
    const user = await User.find({
        _id: {$nin: [myID, ...idReq, ...idAcc, ...idUnsuggest]},
        deleted: false,
        status: "active"
    });
    res.render("friend/no-friend", {
        titlePage: "Gợi ý",
        user: user
    });
}

// [GET] /friend/request-friend
module.exports.reqfriend = async (req, res) => {
    // Socket friend
    socketFriend.friend(req, res);
    // End Socket friend
    const myID = res.locals.user.id;
    const myUser = await User.findOne({
        _id: myID,
        deleted: false
    }).select("requestFriends");
     const requestFriends = myUser.requestFriends;
    const idRequest = requestFriends.map(item => item);
    const user = await User.find({
        _id: {$in: idRequest},
        deleted: false,
        status: "active"
    });
    
    res.render("friend/request-friend", {
        titlePage: "Lời mời đã gửi",
        user: user
    });
}

// [GET] /friend/accept-friend
module.exports.acceptfriend = async (req, res) => {
    // Socket friend
    socketFriend.friend(req, res);
    // End Socket friend
    const myID = res.locals.user.id;
    const myUser = await User.findOne({
        _id: myID,
        deleted: false
    }).select("acceptFriends");
    const acceptFriend = myUser.acceptFriends;
    const idAccept = acceptFriend.map(item => item);
    const user = await User.find({
        _id: {$in: idAccept},
        deleted: false,
        status: "active"
    });
    
    res.render("friend/accept-friend", {
        titlePage: "Lời mời kết bạn",
        user: user
    });
}