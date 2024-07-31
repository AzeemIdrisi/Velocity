import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: false, // For channels there maybe many receipents
  },
  messageType: {
    type: String,
    enum: ["text", "file"],
    required: true,
  },
  content: {
    type: String,
    required: function () {
      return this.messageType === "text";
    }, // If messageType is text then content is required
  },
  fileUrl: {
    type: String,
    required: function () {
      return this.messageType === "file";
    }, // If messageType is file then content is required
  },
  timestamp: {
    type: Date,
    default: Date.now(),
  },
});

const Message = mongoose.model("Messages", MessageSchema);

export default Message;
