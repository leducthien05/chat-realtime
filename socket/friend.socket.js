const User = require("../model/user.model");
const Room = require("../model/room.model");

module.exports.friend = async (req, res) => {
    const myID = res.locals.user.id;
    _io.once('connection', (socket) => {
        console.log('a user connected');
        //Gửi yêu cầu kết bạn
        socket.on("CLIENT_REQUEST_FRIEND", async (idUser) => {
            const user = await User.findOne({
                _id: idUser,
                deleted: false
            });
            if (!user) {
                return;
            }
            // myID: Id của A
            // idUser: Id của B
            // Kiểm tra B có trong requestFriends 
            const existReqA = await User.findOne({
                _id: myID,
                requestFriends: idUser
            });
            if (!existReqA) {
                await User.updateOne({
                    _id: myID,
                    deleted: false
                }, {
                    $push: {
                        requestFriends: idUser
                    }
                });
            }
            // Kiểm tra A có trong AcceptFriends 
            const existAcceptB = await User.findOne({
                _id: idUser,
                acceptFriends: myID
            });

            if (!existAcceptB) {
                await User.updateOne({
                    _id: idUser,
                    deleted: false
                }, {
                    $push: {
                        acceptFriends: myID
                    }
                });
            }
            const myUser = await User.findOne({
                _id: myID,
                deleted: false
            });
            // Thông tin của A trả về cho B
            socket.broadcast.emit("SERVER_RETURN_REQUEST", {
                myUser: myUser,
                myID: myID,
                userID: idUser
            });
            // Trả về số lời mời đã gửi
            const lengthReq = myUser.requestFriends.length;
            socket.emit("SERVER_RETURN_LENGTH_REQUEST", {
                length: lengthReq,
                myID: myID,
                userID: idUser
            });
        });

        // Hủy gửi yêu cầu kết bạn
        socket.on("CLIENT_CANCEL_FREQUEST", async (idUser) => {
            // Kiểm tra tồn tại idUser hay không
            const user = await User.findOne({
                _id: idUser,
                deleted: false
            });
            if (!user) {
                return;
            }
            // myID: Id của A
            // idUser: Id của B
            // Kiểm tra B có trong requestFriends 
            const existReqA = await User.findOne({
                _id: myID,
                requestFriends: idUser
            });
            if (existReqA) {
                await User.updateOne({
                    _id: myID,
                    deleted: false
                }, {
                    $pull: {
                        requestFriends: idUser
                    }
                });
            }
            // Kiểm tra A có trong AcceptFriends 
            const existAcceptB = await User.findOne({
                _id: idUser,
                acceptFriends: myID
            });

            if (existAcceptB) {
                await User.updateOne({
                    _id: idUser,
                    deleted: false
                }, {
                    $pull: {
                        acceptFriends: myID
                    }
                });
            }
            // Trả về số lời mời đã gửi
            const myUser = await User.findOne({
                _id: myID,
                deleted: false
            });
            const lengthReq = myUser.requestFriends.length;
            socket.emit("SERVER_RETURN_LENGTH_REQUEST", {
                length: lengthReq,
                myID: myID,
                userID: idUser
            });
        });

        //Gỡ gợi ý kết bạn
        socket.on("CLIENT_CANCEL_SUGGEST", async (idUser) => {
            // Kiểm tra tồn tại idUser hay không
            const user = await User.findOne({
                _id: idUser,
                deleted: false
            });
            if (!user) {
                return;
            }
            // myID: Id của A
            // idUser: Id của B
            // Kiểm tra B có trong requestFriends 
            const existReqA = await User.findOne({
                _id: myID,
                listCancelFriends: idUser
            });
            if (!existReqA) {
                await User.updateOne({
                    _id: myID,
                    deleted: false
                }, {
                    $push: {
                        listCancelFriends: idUser
                    }
                });
            }
        });

        //Đồng ý lời mời kết bạn
        socket.on("CLIENT_ACCEPT_FRIEND", async (idUser) => {
            // Kiểm tra tồn tại idUser hay không
            const user = await User.findOne({
                _id: idUser,
                deleted: false
            });
            if (!user) {
                return;
            }
            // myID: Id của A
            // idUser: Id của B
            // Kiểm tra B có trong requestFriends 
            console.log(idUser, myID)
            const existReqA = await User.findOne({
                _id: idUser,
                requestFriends: myID
            });
            // Kiểm tra A có trong acceptFriends 
            const existAccB = await User.findOne({
                _id: myID,
                acceptFriends: idUser
            });
            let room;
            if (existReqA && existAccB) {
                const data = {
                    avatar: "",
                    type_room: "friend",
                    status: "active",
                }
                const user = [
                    {
                        user_id: myID,
                        role: "supperAdmin"
                    },
                    {
                        user_id: idUser,
                        role: "supperAdmin"
                    }
                ];
                data.user = user;
                room = new Room(data);
                await room.save();
            }
            if (existReqA) {
                await User.updateOne({
                    _id: myID,
                    deleted: false
                }, {
                    $pull: {
                        acceptFriends: idUser
                    },
                    $push: {
                        listFriends: {
                            friend_id: idUser,
                            room_chat_id: room.id
                        }
                    }
                }
                );
            }

            if (existAccB) {
                await User.updateOne({
                    _id: idUser,
                    deleted: false
                }, {
                    $pull: {
                        requestFriends: myID
                    },
                    $push: {
                        listFriends: {
                            friend_id: myID,
                            room_chat_id: room.id
                        }
                    }
                });
            }
        });
    });
}