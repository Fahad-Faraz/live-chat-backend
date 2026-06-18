  import mongoose from "mongoose";

  const messageSchema = new mongoose.Schema(
    {
      senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

          chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
    },



      receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      text: {
        type: String,
        default: "",
      },

      image: {
        type: String,
        default: "",
      },

      fileUrl: {
        type: String,
        default: "",
      },

      fileName: {
        type: String,
        default: "",
      },

      voice: {
      type: String,
      default: "",
      },

      replyTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },

      status: {
        type: String,
        enum: ["sent", "delivered", "seen"],
        default: "sent",
      },

      isRead: {
        type: Boolean,
        default: false,
      },

      reactions: [
     {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
     },
    emoji: String,
    },
   ],

     pinned: {
    type: Boolean,
    default: false,
     },

      deleted: {
        type: Boolean,
        default: false,
      },
    },
    {
      timestamps: true,
    }
  );

  export default mongoose.model(
    "Message",
    messageSchema
  );