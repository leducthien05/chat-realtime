//ENV
require("dotenv").config()
const port = process.env.PORT;
//Express
const express = require('express');
const app = express();
//SocketIO
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
//globle 
global._io = io;
//PUG
app.set("views", `${__dirname}/view`);
app.set("view engine", 'pug');
//file tĩnh
app.use(express.static(`${__dirname}/public/`));
//router
const routerChat = require("./router/index.router");
routerChat(app);

io.on('connection', (socket) => {
  console.log('a user connected');
  //Gửi dữ liệu
  socket.emit("SERVER_SEND_CLIENT", socket.id);
  socket.on("CLIENT_SEND_MESSAGE", (mess)=>{
    console.log("message " + mess);
    //A gửi lên server, server chỉ trả về cho A
    //Ví dụ: A gửi tin nhắn lỗi, server gửi thông báo lỗi về cho A
    // socket.emit("SERVER_RETURN_MESSAGE", mess);
    //A gửi lên server, server trả về cho A, B, C, .....
    //Ví dụ: Group chat
    // io.emit("SERVER_RETURN_MESSAGE", mess);
    socket.broadcast.emit("SERVER_RETURN_MESSAGE", mess)

    
  })
});

server.listen(port, () => {
  console.log(`listening on: ${port}`);
});