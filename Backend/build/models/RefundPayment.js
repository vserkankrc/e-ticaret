"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _mongoose = _interopRequireDefault(require("mongoose"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
// models/RefundPayment.js

const refundPaymentSchema = new _mongoose.default.Schema({
  userId: {
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: "Users",
    required: true
  },
  orderId: {
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: "Order",
    required: true
  },
  paymentTransactionId: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "success", "failed"],
    default: "pending"
  },
  errorMessage: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});
var _default = exports.default = _mongoose.default.model("RefundPayment", refundPaymentSchema);