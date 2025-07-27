"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _mongoose = _interopRequireDefault(require("mongoose"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const orderSchema = new _mongoose.default.Schema({
  userId: {
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  },
  products: [{
    productId: {
      type: _mongoose.default.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    image: {
      type: String,
      default: ""
    },
    color: {
      type: String,
      default: null // zorunlu değilse
    },
    size: {
      type: String,
      default: null
    }
  }],
  cancelRequest: {
    type: Boolean,
    default: false // kullanıcı iptal talebinde bulunmuş mu?
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['hazırlanıyor', 'kargoya verildi', 'teslim edildi', 'iptal edildi'],
    default: 'hazırlanıyor'
  },
  address: {
    district: {
      type: String,
      required: true
    },
    province: {
      type: String,
      required: true
    },
    postalCode: {
      type: String,
      required: true
    },
    addressDetail: {
      type: String,
      required: true
    }
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentTransactionId: {
    type: String
  },
  paymentMethod: {
    type: String,
    enum: ['iyzico', 'credit_card', 'paypal', 'bank_transfer', 'cash_on_delivery'],
    required: true
  },
  trackingNumber: {
    type: String,
    default: null
  },
  agreementAccepted: {
    type: Boolean,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});
var _default = exports.default = _mongoose.default.model('Order', orderSchema);