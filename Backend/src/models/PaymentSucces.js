import mongoose from "mongoose";
import nanoid from "../utils/nanoid.js";

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

// Ürün bazlı ödeme işlemleri
const ItemTransactionSchema = new Schema({
  uid: { type: String, default: () => nanoid(), required: true, unique: true },
  itemId: {
    type: ObjectId,
    ref: "Products",
    required: true,
  },
  paymentTransactionId: { type: String, required: true },
  price: { type: Number, required: true },
  paidPrice: { type: Number, required: true },
});

// Ödeme başarı modeli
const PaymentSuccessSchema = new Schema(
  {
    uid: {
      type: String,
      default: () => nanoid(),
      required: true,
      unique: true,
    },
    status: { type: String, required: true, enum: ["success"] },
    userId: { type: ObjectId, ref: "Users", required: true }, // kullanıcı referansı
    cartId: { type: String, ref: "Carts", required: true },
    conversationId: { type: String, required: true },
    currency: { type: String, required: true, enum: ["TRY", "USD", "EUR"] },
    paymentId: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    paidPrice: { type: Number, required: true },
    itemTransactions: { type: [ItemTransactionSchema], required: true },
    log: { type: Schema.Types.Mixed, required: true },

    // --- İADE TAKİBİ İÇİN EK ALANLAR ---
    refundStatus: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: null,
    },
    refundTransactionId: {
      type: String,
      default: null,
    },
    refundDate: {
      type: Date,
      default: null,
    },
    refundResponseLog: {
      type: Schema.Types.Mixed,
      default: null,
    },
  },
  {
    collection: "PaymentSuccess",
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        delete ret.__v;
        return { ...ret };
      },
    },
  }
);

const PaymentSuccess = mongoose.model("PaymentSuccess", PaymentSuccessSchema);

export default PaymentSuccess;
