const User = require("../model/user.model");
const Room = require("../model/room.model");
const Chat = require("../model/chat.model");

// [GET] /chat
module.exports.index = async (req, res) => {
    try {
        const user = res.locals.user;

        // 1. Lấy chat của user (mới nhất trước)
        const allChat = await Chat.find({
            deleted: false,
            user_id: user.id
        }).sort({ createdAt: -1 });
        const MyRoom = await Room.find({
            deleted: false,
            "user.user_id": user.id
        }).sort({ createAt: -1 });
        // 2. Nếu chưa có chat
        if (allChat.length === 0) {
            return res.redirect(`/chat/room/${MyRoom[0].id}`);
        }

        // 3. Lấy room mới nhất
        const roomNewBest = await Room.findOne({
            _id: allChat[0].room_chat_id
        });


        // 8. render
        res.redirect(`/chat/room/${roomNewBest._id}`);
    } catch (error) {
        console.log(error)
        res.send("OK")
    }

}
// [GET] /chat/room/:idRoom
module.exports.roomChat = async (req, res) => {
    const idRoom = req.params.idRoom;
    const allRoom = await Room.find({
        deleted: false,
        "user.user_id": res.locals.user.id
    });
    for (const room of allRoom) {
        if (room.type_room == "friend") {
            const idFriend = room.user.find(item => item.user_id != res.locals.user.id);
            if (idFriend) {
                const infoFriend = await User.findOne({
                    _id: idFriend.user_id,
                    deleted: false
                });
                room.infoFriend = infoFriend
            }
        }
    }
    // Lấy tin nhắn
    const chat = await Chat.find({
        deleted: false,
        room_chat_id: idRoom
    });
    // Lấy thông tin người dùng trong mess
    const idUser = chat.map(item => item.user_id);
    const user = await User.find({
        _id: { $in: idUser },
        deleted: false
    });
    const userMap = {};
    user.forEach(item => {
        userMap[item._id] = item.userName;
    });
    chat.forEach(item => {
        item.userName = userMap[item.user_id]
    });
    const room = await Room.findOne({
        _id: idRoom
    });
    
    res.render("chat/index", {
        chats: chat,
        titlePage: "Message",
        myRoom: allRoom,
        roomChat: room
    });
}
// [GET] /chat/create
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
// [POST] /chat/create
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

