"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _mongoose = _interopRequireDefault(require("mongoose"));
var _nanoid = _interopRequireDefault(require("../utils/nanoid.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const {
  Schema
} = _mongoose.default;
const {
  ObjectId
} = Schema.Types;

// Ürün bazlı ödeme işlemleri
const ItemTransactionSchema = new Schema({
  uid: {
    type: String,
    default: () => (0, _nanoid.default)(),
    required: true,
    unique: true
  },
  itemId: {
    type: ObjectId,
    ref: "Products",
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
  paidPrice: {
    type: Number,
    required: true
  }
});

// Ödeme başarı modeli
const PaymentSuccessSchema = new Schema({
  uid: {
    type: String,
    default: () => (0, _nanoid.default)(),
    required: true,
    unique: true
  },
  status: {
    type: String,
    required: true,
    enum: ["success"]
  },
  userId: {
    type: ObjectId,
    ref: "Users",
    required: true
  },
  // kullanıcı referansı
  cartId: {
    type: String,
    ref: "Carts",
    required: true
  },
  conversationId: {
    type: String,
    required: true
  },
  currency: {
    type: String,
    required: true,
    enum: ["TRY", "USD", "EUR"]
  },
  paymentId: {
    type: String,
    required: true,
    unique: true
  },
  price: {
    type: Number,
    required: true
  },
  paidPrice: {
    type: Number,
    required: true
  },
  itemTransactions: {
    type: [ItemTransactionSchema],
    required: true
  },
  log: {
    type: Schema.Types.Mixed,
    required: true
  },
  // --- İADE TAKİBİ İÇİN EK ALANLAR ---
  refundStatus: {
    type: String,
    enum: ["pending", "success", "failed"],
    default: null
  },
  refundTransactionId: {
    type: String,
    default: null
  },
  refundDate: {
    type: Date,
    default: null
  },
  refundResponseLog: {
    type: Schema.Types.Mixed,
    default: null
  }
}, {
  collection: "PaymentSuccess",
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      delete ret.__v;
      return {
        ...ret
      };
    }
  }
});
const PaymentSuccess = _mongoose.default.model("PaymentSuccess", PaymentSuccessSchema);
var _default = exports.default = PaymentSuccess;