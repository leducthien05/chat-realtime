const chatRouter = require("./chat.router");

module.exports = (app)=>{
    app.use("/", chatRouter);
}