import User from "../Models/User.js";

const socketHandler = (io) => {
  let users = new Map();

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // 👤 ADD USER
    socket.on("addUser", (userId) => {
      users.set(userId, socket.id);
      io.emit("getOnlineUsers", Array.from(users.keys()));
    });

    // 💬 SEND MESSAGE
    socket.on("sendMessage", ({ senderId, receiverId, message }) => {
      const receiverSocketId = users.get(receiverId);

      if (receiverSocketId) {
        io.to(receiverSocketId).emit("getMessage", {
          ...message,
          senderId,
          status: "delivered",
        });

        // optional: notify sender also
        const senderSocketId = users.get(senderId);
        if (senderSocketId) {
          io.to(senderSocketId).emit("messageDelivered", {
            receiverId,
          });
        }
      }
    });

    // ⌨️ TYPING
    socket.on("typing", ({ senderId, receiverId }) => {
      const receiverSocketId = users.get(receiverId);

      if (receiverSocketId) {
        io.to(receiverSocketId).emit("typing", { senderId });
      }
    });

    socket.on("stopTyping", ({ senderId, receiverId }) => {
      const receiverSocketId = users.get(receiverId);

      if (receiverSocketId) {
        io.to(receiverSocketId).emit("stopTyping", { senderId });
      }
    });

    // ✔ MESSAGE SEEN
     socket.on("messageSeen", ({ senderId }) => {
  const senderSocketId = users.get(senderId);

  if (senderSocketId) {
    io.to(senderSocketId).emit("messageSeen");
  }
});

     socket.on(
  "callUser",
  ({receiverId})=>{

  const receiverSocket =
  users.get(receiverId);

  if(receiverSocket){

   io.to(receiverSocket)
   .emit(
    "incomingCall"
   );
   }

  });
    // ❌ DISCONNECT
    socket.on("disconnect", async () => {
      for (let [userId, socketId] of users.entries()) {
        if (socketId === socket.id) {
          users.delete(userId);

          try {
            await User.findByIdAndUpdate(userId, {
              lastSeen: new Date(),
            });
          } catch (err) {
            console.log("LastSeen error:", err.message);
          }

          break;
        }
      }

      io.emit("getOnlineUsers", Array.from(users.keys()));
      console.log("User disconnected:", socket.id);
    });
  });
};

export default socketHandler;