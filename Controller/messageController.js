import Message from "../Models/Message.js";
import User from "../Models/User.js";
/* =======================
   SEND MESSAGE
======================= */
export const sendMessage = async (req, res) => {
  try {
    const {
  receiverId,
  text,
  replyTo,
} = req.body;

// 🔥 Check if receiver exists
const receiver =
  await User.findById(
    receiverId
  );

if (!receiver) {
  return res
    .status(404)
    .json({
      message:
        "User not found",
    });
}

// 🚫 Check if sender is blocked
if (
  receiver.blockedUsers.includes(
    req.user.id
  )
) {
  return res
    .status(403)
    .json({
      message:
        "You are blocked by this user",
    });
}

let image = "";
let fileUrl = "";
let fileName = "";
let voice = "";

if (req.file) {
  if (
    req.file.mimetype.startsWith(
      "image"
    )
  ) {
    image = req.file.path;
  } else if (
    req.file.mimetype.startsWith(
      "audio"
    )
  ) {
    voice = req.file.path;
  } else {
    fileUrl =
      req.file.path;
    fileName =
      req.file.originalname;
  }
}

const message =
  await Message.create({
    senderId:
      req.user.id,
    receiverId,
    text,
    image,
    fileUrl,
    fileName,
    voice,
    replyTo, // Optional
    status: "sent",
    isRead: false,
  });

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/* =======================
   GET MESSAGES + AUTO SEEN
======================= */
export const getMessages = async (req, res) => {
  try {
    const { receiverId } = req.params;

    const messages = await Message.find({
      $or: [
        {
          senderId: req.user.id,
          receiverId,
        },
        {
          senderId: receiverId,
          receiverId: req.user.id,
        },
      ],
    }).sort({ createdAt: 1 });

    // 🔥 AUTO MARK AS SEEN (MAIN FEATURE)
    await Message.updateMany(
      {
        senderId: receiverId,
        receiverId: req.user.id,
        isRead: false,
      },
      {
        status: "seen",
        isRead: true,
      }
    );

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/* =======================
   MANUAL MARK AS SEEN
======================= */
export const markMessageSeen = async (req, res) => {
  try {
    const { messageId } = req.body;

    const updatedMessage = await Message.findByIdAndUpdate(
      messageId,
      {
        status: "seen",
        isRead: true,
      },
      { new: true }
    );

    res.json(updatedMessage);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/* =======================
   UNREAD COUNT (SIDEBAR BADGE)
======================= */
export const getUnreadCount = async (req, res) => {
  try {
    const unread = await Message.aggregate([
      {
        $match: {
          receiverId: req.user.id,
          isRead: false,
        },
      },
      {
        $group: {
          _id: "$senderId",
          count: { $sum: 1 },
        },
      },
    ]);

    res.json(unread);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const addReaction = async (
  req,
  res
) => {
  try {
    const { messageId, emoji } =
      req.body;

    const msg =
      await Message.findById(
        messageId
      );

    const existing =
      msg.reactions.find(
        (r) =>
          r.userId.toString() ===
          req.user.id
      );

    if (existing) {
      existing.emoji =
        emoji;
    } else {
      msg.reactions.push({
        userId:
          req.user.id,
        emoji,
      });
    }

    await msg.save();

    res.json(msg);
  } catch (error) {
    res.status(500).json({
      message:
        error.message,
    });
  }
};

export const deleteMessage =
  async (req, res) => {
    try {
      const { messageId } =
        req.params;

      const msg =
        await Message.findById(
          messageId
        );

      if (
        msg.senderId.toString() !==
        req.user.id
      ) {
        return res
          .status(403)
          .json({
            message:
              "Not allowed",
          });
      }

      msg.deleted = true;
      msg.text =
        "This message was deleted";

      msg.image = "";
      msg.fileUrl = "";
      msg.voice = "";

      await msg.save();

      res.json(msg);
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };

  export const editMessage =
  async (req, res) => {
    try {
      const {
        messageId,
        text,
      } = req.body;

      const msg =
        await Message.findById(
          messageId
        );

      if (
        msg.senderId.toString() !==
        req.user.id
      ) {
        return res
          .status(403)
          .json({
            message:
              "Not allowed",
          });
      }

      msg.text = text;

      await msg.save();

      res.json(msg);
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };

  export const pinMessage =
  async (req, res) => {
    try {
      const { messageId } =
        req.body;

      const msg =
        await Message.findByIdAndUpdate(
          messageId,
          {
            pinned: true,
          },
          {
            new: true,
          }
        );

      res.json(msg);
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };
  export const forwardMessage =
async(req,res)=>{

 const {
  messageId,
  receiverId
 } = req.body;

 const oldMsg =
 await Message.findById(
  messageId
 );

 const msg =
 await Message.create({

 senderId:req.user.id,

 receiverId,

 text:oldMsg.text,

 image:oldMsg.image,

 fileUrl:
 oldMsg.fileUrl,

 fileName:
 oldMsg.fileName

 });

 res.json(msg);
}