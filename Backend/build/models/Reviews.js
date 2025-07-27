"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _mongoose = _interopRequireDefault(require("mongoose"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const reviewSchema = new _mongoose.default.Schema({
  productId: {
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: "Product",
    // Products.js içindeki model ismine birebir uygun
    required: true
  },
  userId: {
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: "Users",
    // Users.js içinde `mongoose.model("Users", UsersSchema)` olduğundan
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  }
}, {
  timestamps: true
});
const Reviews = _mongoose.default.model("Reviews", reviewSchema); // Model adı dosya ismiyle birebir
var _default = exports.default = Reviews;