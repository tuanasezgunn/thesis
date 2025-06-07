const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
  },
});


const messagesPerRoom = {}; 
io.on("connection", (socket) => {
  console.log("Bir kullanıcı bağlandı");

  // Kullanıcı odada katılınca
  socket.on("join-room", ({ room, username }) => {
    socket.join(room);
    console.log(`${username} katıldı: ${room}`);

    // Önceki mesajlar varsa gönder
    if (messagesPerRoom[room]) {
      socket.emit("room-messages", messagesPerRoom[room]);
    }

    // Diğer kullanıcılara bildirim
    socket.to(room).emit("user-connected", username);
  });

  // Mesaj gönderme
  socket.on("send-chat-message", ({ message, name, room }) => {
    const msgData = { message, name };

    // Odanın mesajlarını depolamak
    if (!messagesPerRoom[room]) messagesPerRoom[room] = [];
    messagesPerRoom[room].push(msgData);

    // Odaya mesajı gönder
    io.to(room).emit("chat-message", msgData);
  });

  // Kullanıcı odadan ayrıldığında
  socket.on("disconnect", () => {
    console.log("Bir kullanıcı ayrıldı");
  });
});

server.listen(3000, () => {
  console.log("Socket sunucusu 3000 portunda çalışıyor");
});
