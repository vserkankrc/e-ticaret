"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _mongoose = _interopRequireDefault(require("mongoose"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const {
  Schema
} = _mongoose.default;
const SavedCardSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  },
  cardToken: {
    type: String,
    required: true,
    unique: true
  },
  // İyzico tokeni
  cardUserKey: {
    type: String,
    required: true
  },
  cardHolderName: {
    type: String,
    required: true
  },
  cardType: {
    type: String
  },
  last4Digits: {
    type: String,
    required: true
  },
  expireMonth: {
    type: String,
    required: true
  },
  expireYear: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});
var _default = exports.default = _mongoose.default.model('SavedCard', SavedCardSchema);