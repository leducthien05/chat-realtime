const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
    user_id: String,
    content: String,
    image: Array,
    room_chat_id: String,
    deleted: {
        type:Boolean,
        default: false
    },
    deletedAt: Date
}, {
    timestamps: true
});

const Chat = mongoose.model("Chat", chatSchema, "chat");
module.exports = Chat;