const User = require("../model/user.model");
const Room = require("../model/room.model");
const Chat = require("../model/chat.model");

const uploadImage = require("../helper/uploadToCloudinary");

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
            console.log(data)
            let arrImage = [];
            try {
                for (const item of data.image) {
                    const image = await uploadImage(item);
                    arrImage.push(image);
                }
            } catch (error) {
                console.log(error)
            }
            console.log(arrImage);
            const dataChat = {
                user_id: data.myID,
                content: data.content,
                image: arrImage,
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
                user: userSend,
                image: arrImage
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