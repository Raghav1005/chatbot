import mongoose, { Schema, model, models } from "mongoose";

const messageSchema = new Schema({
  role: { type: String, enum: ["user", "assistant"], required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const chatSchema = new Schema({
  userId: { type: String, required: true },
  model: { type: String, required: true },
  messages: [messageSchema],
  createdAt: { type: Date, default: Date.now },
});

export const Chat = models.Chat || model("Chat", chatSchema);
