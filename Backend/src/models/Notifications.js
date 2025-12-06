// backend/models/Notifications.js
import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "Users" }, // Bireysel kullanıcıya
    type: {
      type: String,
      enum: ["order", "message", "system"],
      default: "system",
    },
    referenceId: { type: mongoose.Schema.Types.ObjectId }, // Sipariş, mesaj veya ürün ID’si
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    hiddenBy: {
      type: [String], // kullanıcı ID’lerini tutacak
      default: [],
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Notifications", notificationSchema);
