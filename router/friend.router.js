const express = require("express");
const router = express.Router();
const controller = require("../controller/friend.controller");

router.get("/no-friend", controller.index);
router.get("/request-friend", controller.reqfriend);
router.get("/accept-friend", controller.acceptfriend);
router.get("/all-friends", controller.allfriends);

module.exports = router;