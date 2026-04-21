const mongoose = require("mongoose");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
    userName: String,
    password: String,
    tokenUser: String,
    phone: String,
    email: String,
    avatar: String,
    removeFriends: Array,
    requestFriends: Array,
    acceptFriends: Array, 
    listCancelFriends: Array,
    listFriends: [
        {
            friend_id: String,
            room_chat_id: String
        }
    ],
    statusOnline: String,
    status:{
        type: String,
        default: "active"
    },
    deleted: {
        type:Boolean,
        default: false
    },
    deletedAt: Date
}, {
    timestamps: true
});

const User = mongoose.model("User", userSchema, "user");
module.exports = User;