"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _mongoose = _interopRequireDefault(require("mongoose"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
// models/Favorite.js

const favoriteSchema = new _mongoose.default.Schema({
  userId: {
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  productId: {
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  }
}, {
  timestamps: true
});
var _default = exports.default = _mongoose.default.model("Favorite", favoriteSchema);