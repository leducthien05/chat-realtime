const chatRouter = require("./chat.router");
const userRouter = require("./user.router");
const homeRouter = require("./home");
const friendRouter = require("./friend.router");

const userMiddleware = require("../middleware/user.middleware");
const infoMiddleware = require("../middleware/info.middleware");

module.exports = (app)=>{
    app.use(infoMiddleware.info);
    app.use("/home", userMiddleware.user, homeRouter);
    app.use("/friend", userMiddleware.user, friendRouter);
    app.use("/chat", userMiddleware.user, chatRouter);
    app.use("/user", userRouter);
}