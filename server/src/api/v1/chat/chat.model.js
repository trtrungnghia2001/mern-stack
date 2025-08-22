import mongoose, { Schema } from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    roomId: { type: String, require: true },
    sender: { type: Schema.Types.ObjectId, ref: "user", require: true },
    message: String,
    files: [
      {
        type: String,
        url: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const chatModel = mongoose.models.chat || mongoose.model("chat", chatSchema);

export default chatModel;
