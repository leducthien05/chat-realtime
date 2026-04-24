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
                requestFriends: idUser,
                "listFriends.friend_id": idUser
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
                acceptFriends: myID,
                "listFriends.friend_id": myID
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
            const Youruser = await User.findOne({
                _id: idUser,
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
            const lengthAccept = Youruser.acceptFriends.length;
            console.log(lengthReq, lengthAccept)
            _io.emit("SERVER_RETURN_LENGTH_REQUEST", {
                lengthReq: lengthReq,
                lengthAccept: lengthAccept,
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
            const Youruser = await User.findOne({
                _id: idUser,
                deleted: false
            });
            const lengthAccept = Youruser.acceptFriends.length;
            const myUser = await User.findOne({
                _id: myID,
                deleted: false
            });
            const lengthReq = myUser.requestFriends.length;
            _io.emit("SERVER_RETURN_LENGTH_REQUEST", {
                lengthReq: lengthReq,
                lengthAccept: lengthAccept,
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
                requestFriends: myID,
                "listFriends.friend_id": {$ne: myID}
            });
            // Kiểm tra A có trong acceptFriends 
            const existAccB = await User.findOne({
                _id: myID,
                acceptFriends: idUser,
                "listFriends.friend_id": {$ne: idUser}
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
            const myUser = await User.findOne({
                _id: myID,
                deleted: false
            });
            const Youruser = await User.findOne({
                _id: idUser,
                deleted: false
            });
            const lengthFriendA = Youruser.listFriends.length;
            const lengthFriendB = myUser.listFriends.length;
            // Thông tin của A trả về cho B
            _io.emit("SERVER_RETURN_LENGTH_FRIEND", {
                lengthFriendA: lengthFriendA,
                lengthFriendB: lengthFriendB,
                myID: myID,
                userID: idUser
            });
            
        });

        // Hủy kết bạn
        socket.on("CLIENT_UNFRIEND", async (idUser) => {
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
            const usera = await User.findOne({
                _id: myID,
                deleted: false,
                "listFriends.friend_id": idUser
            });
            const userb = await User.findOne({
                _id: idUser,
                deleted: false,
                "listFriends.friend_id": myID
            });
            if (usera && userb) {
                await User.updateOne({
                    _id: myID,
                    deleted: false
                }, {
                    $pull: {
                        listFriends: {
                            friend_id: idUser
                        }
                    }
                });
                await User.updateOne({
                    _id: idUser,
                    deleted: false
                }, {
                    $pull: {
                        listFriends: {
                            friend_id: myID
                        }
                    }
                });
            }  
            const lengthFriendA = usera.listFriends.length;
            const lengthFriendB = userb.listFriends.length;
            _io.emit("SERVER_RETURN_LENGTH_FRIEND", {
                lengthFriendA: lengthFriendA,
                lengthFriendB: lengthFriendB,
                myID: myID,
                userID: idUser
            });          
        });

        // Từ chôi lời mời kết bạn
        socket.on("CLIENT_REFUSE_FRIEND", async (idUser) => {
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
            const existReqA = await User.findOne({
                _id: idUser,
                requestFriends: myID
            });
            const existAccB = await User.findOne({
                _id: myID,
                acceptFriends: idUser
            });
            if (existAccB) {
                await User.updateOne({
                    _id: myID,
                    deleted: false
                }, {
                    $pull: {
                        acceptFriends: idUser
                    }
                });
            }
            if (existReqA) {
                await User.updateOne({
                    _id: idUser,
                    deleted: false
                }, {
                    $pull: {
                        requestFriends: myID
                    }
                });
            }
                // Trả về số lời mời đã gửi
                const Youruser = await User.findOne({
                    _id: idUser,
                    deleted: false
                });
                const lengthAccept = Youruser.acceptFriends.length;
                const myUser = await User.findOne({ 
                    _id: myID,
                    deleted: false
                });
                const lengthRequest = myUser.requestFriends.length;

                _io.emit("SERVER_RETURN_LENGTH_REQUEST", {
                    lengthReq: lengthRequest,
                    lengthAccept: lengthAccept,
                    myID: myID,
                    userID: idUser
                });
        });
    });
}