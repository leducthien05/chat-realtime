const User = require("../model/user.model");
const Room = require("../model/room.model");
const Chat = require("../model/chat.model");

module.exports = async (req, res) => {
    const idRoom = req.params.idRoom;
    // Socket Send Mess
    const UserAccount = res.locals.user;
    const user_id = UserAccount._id;
    const userName = UserAccount.userName;
    const avatar = UserAccount.avatar
    _io.once('connection', (socket) => {
        // Thêm người dùng vào nhóm
        socket.join(idRoom);
        socket.on("CLIENT_SEND_MESS", async (data) => {
            const dataChat = {
                user_id: data.myID,
                content: data.content,
                room_chat_id: idRoom
            }
            const chat = new Chat(dataChat);
            await chat.save();
            const userSend = await User.findOne({
                _id: data.myID
            }).select("userName");
            _io.to(idRoom).emit("SERVER_RETURN_MESS", {
                myID: data.myID,
                content: data.content,
                user: userSend
            });
        });
        socket.on("CLIENT_SEND_TYPING", (content) => {
            console.log(content)
            socket.broadcast.to(idRoom).emit("SERVER_RETURN_TYPING", {
                userID: user_id,
                avatar: avatar,
                userName: userName,
                type: content
            });

        });

    });
}