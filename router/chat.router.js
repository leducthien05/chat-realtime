const express = require("express");
const router = express.Router();

const controller = require("../controller/chat.controller");
const validator = require("../validator/auth");

router.get("/", controller.index);
router.get("/create", controller.createRoom);
router.post("/create", validator.createRoom, controller.createRoomPost);
router.get("/room/:idRoom", controller.roomChat);

module.exports = router;