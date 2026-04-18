const chatRouter = require("./chat.router");
const userRouter = require("./user.router");

module.exports = (app)=>{
    app.use("/", chatRouter);
    app.use("/user", userRouter);
}