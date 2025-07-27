"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _mongoose = _interopRequireDefault(require("mongoose"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const productQuestionSchema = new _mongoose.default.Schema({
  productId: {
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  userId: {
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  question: {
    type: String,
    required: true,
    trim: true
  },
  answer: {
    type: String,
    default: "" // Başlangıçta boş olabilir, satıcı sonradan cevaplayacak
  },
  isAnswered: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true // createdAt, updatedAt otomatik eklenecek
});
const ProductQuestion = _mongoose.default.model("ProductQuestion", productQuestionSchema);
var _default = exports.default = ProductQuestion;