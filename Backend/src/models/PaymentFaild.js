import mongoose from "mongoose";
import nanoid from "../utils/nanoid.js";

const { Schema } = mongoose;

const PaymentFailedSchema = new Schema(
  {
    uid: { type: String, default: nanoid(), required: true, unique: true },
    status: { type: String, required: true, enum: ["failure"] },
    conversationId: { type: String, required: true },
    errorCode: { type: String, required: true },
    errorMessage: { type: String, required: true },
    log: { type: Schema.Types.Mixed, required: true },
  },
  {
    collection: "PaymentFailed",
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        delete ret.__v;
        return { ...ret };
      },
    },
  }
);

const PaymentFailed = mongoose.model("PaymentFailed", PaymentFailedSchema);

export default PaymentFailed;
