import { Server } from "socket.io";

import conversations from "./schemas/messageSchema.js";

const socketConnection = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    // console.log("socket connected successfully with id " + socket.id);

    socket.on("disconnect", () => {
      // console.log("user disconnected");
    });

    socket.on("sendMessage", async (messageLayout) => {
      try {
        const newMessgae = new conversations(messageLayout);
        await newMessgae.save();
        io.emit("sendLiveMessage", newMessgae);
      } catch (err) {
        console.log("check socket.js\n", err);
      }
    });


    socket.on("login", (userData) => {
      console.log(`a user logged in ${userData.email}`);
    });
  });
};

export default socketConnection;
