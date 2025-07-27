"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _mongoose = _interopRequireDefault(require("mongoose"));
var _nanoid = _interopRequireDefault(require("../utils/nanoid.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const CategorySchema = new _mongoose.default.Schema({
  uid: {
    type: String,
    default: (0, _nanoid.default)(),
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    unique: true
  },
  img: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});
const Category = _mongoose.default.model("Category", CategorySchema);
var _default = exports.default = Category;