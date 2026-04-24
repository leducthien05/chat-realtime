const User = require("../model/user.model");
const Room = require("../model/room.model");

module.exports.index = async (req, res) => {
    res.render("chat/index", {
        titlePage: "Chat"
    });
}

module.exports.createRoom = async (req, res) => {
    const user = res.locals.user;
    const idFriend = user.listFriends.map(item => item.friend_id);
    const listFriend = await User.find({
        deleted: false,
        _id: { $in: idFriend }
    });
    console.log("listFriend", listFriend);
    res.render("chat/create-room-chat", {
        titlePage: "Tạo phòng chat",
        listFriend: listFriend
    });
}

module.exports.createRoomPost = async (req, res) => {
    const userAccount = res.locals.user;
    const dataRoom = {
        title: req.body.title,
        avatar: "",
        type_room: "group",
        status: "active",
    }
    let user = [];
    user.push({
        user_id: userAccount.id,
        role: "admin"
    });
    for (const item of req.body.user_id) {
        user.push({
            user_id: item,
            role: "member"
        });
    }
    dataRoom.user = user;
    const room = new Room(dataRoom);
    await room.save();
    res.send("ok");
}

