//Express
const express = require('express');
const app = express();
//ENV
require("dotenv").config()
const port = process.env.PORT;
const database = require("./config/database");
database.connect();
// body-parser
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
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
// Cấu hình flash
const flash = require('express-flash');
const session = require("express-session");
app.use(session({
  secret: "chat-app-secret",
  resave: false,
  saveUninitialized: false
}));
// cookie-parser
const cookieParser = require('cookie-parser');
app.use(cookieParser('Thienle'));
app.use(flash());
app.use(flash());;
//router
const routerChat = require("./router/index.router");
routerChat(app);

server.listen(port, () => {
  console.log(`listening on: ${port}`);
});