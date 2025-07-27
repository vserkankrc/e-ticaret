// models/RefundPayment.js
import mongoose from "mongoose";

const refundPaymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
  paymentTransactionId: { type: String, required: true },
  price: { type: Number, required: true },
  status: { type: String, enum: ["pending", "success", "failed"], default: "pending" },
  errorMessage: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("RefundPayment", refundPaymentSchema);
