const User = require("../model/user.model");

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

        // Hủy gửi yêu cầu kết bạn
        socket.on("CLIENT_CANCEL_FREQUEST", async (idUser)=>{
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
        });

        //Gỡ gợi ý kết bạn
        socket.on("CLIENT_CANCEL_SUGGEST", async (idUser)=>{
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
    });
}