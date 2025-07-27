"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _mongoose = _interopRequireDefault(require("mongoose"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const CouponSchema = new _mongoose.default.Schema({
  code: {
    type: String,
    required: true,
    unique: true
  },
  discount: {
    type: Number,
    required: true
  },
  expirationDate: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});
const Coupon = _mongoose.default.model('Coupon', CouponSchema);
var _default = exports.default = Coupon;