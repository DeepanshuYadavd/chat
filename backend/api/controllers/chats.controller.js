import { Chats } from "../models/chats.schema.js";

export const createChat = async (req, res, next) => {
  try {
    let { users, isGroupChat, chatName } = req.body;
    const loggedinUser = req.user.id;
    if (!users || users.length === 0) {
      return res.status(400).json({
        message: "Users are required",
      });
    }
    //  private chats:
    if (!isGroupChat) {
      users.push(loggedinUser);
      let chatExist = await Chats.findOne({
        isGroupChat: false,
        users: {
          $all: users,
        },
        $expr: {
          $eq: [{ $size: "$users" }, 2],
        },
      })
        .populate("users", "-password")
        .populate("latestMessage");
      if (chatExist) {
        return res.status(200).json(chatExist);
      }
      //  if chat not exist then create it
      const chat = await Chats.create({
        chatName: "Private_Chat",
        isGroupChat: false,
        users,
      });
      const newChat = await Chats.findById(chat._id).populate(
        "users",
        "-password",
      );
      return res.status(200).json(newChat);
    }

    //  group chat:
    users.push(loggedinUser);
    const groupChat = await Chats.create({
      chatName,
      isGroupChat,
      users,
      groupAdmin: loggedinUser,
    });
    const newGroupChat = await Chats.findById(groupChat._id).populate(
      "users",
      "-password",
    );
    return res.status(200).json(newGroupChat);
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};
