import { Chats } from "../api/models/chats.schema.js";
import { Messages } from "../api/models/messages.schema.js";

export const setupSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("user connected", socket.id);

    //  join chat room :
    socket.on("join_chat", (chatId) => {
      socket.join(chatId);
      console.log(`joined chat ${chatId}`);
    });

    //  create message

    socket.on("send_message", async (data) => {
      try {
        const { sender, content, chatId } = data;

        let newMessages = await Messages.create({
          sender,
          content,
          chats: chatId,
        });
        newMessages = await newMessages.populate("sender", "userName email");
        newMessages = await newMessages.populate("chats");
        await Chats.findByIdAndUpdate(chatId, {
          latestMessage: newMessages._id,
        });

        io.to(chatId).emit("receive_message", newMessages);
      } catch (err) {
        console.log(err.message);
      }
    });

    socket.on("disconnect", () => {
      console.log("user disconnected", socket.id);
    });
  });
};
