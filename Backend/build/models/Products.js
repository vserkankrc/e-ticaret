"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _mongoose = _interopRequireDefault(require("mongoose"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
// İnceleme şeması
const ReviewSchema = _mongoose.default.Schema({
  text: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  user: {
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
});

// Ürün şeması
const ProductSchema = _mongoose.default.Schema({
  name: {
    type: String,
    required: false
  },
  price: {
    type: Number,
    required: false
  },
  quantity: {
    type: Number,
    required: false,
    min: 0
  },
  // 🔥 Yeni eklendi: Stok adedi
  images: [{
    type: String,
    required: false
  }],
  reviews: [ReviewSchema],
  description: {
    type: String,
    required: false
  },
  discount: {
    type: Number,
    required: false
  },
  colors: [{
    type: String,
    required: false
  }],
  sizes: [{
    type: String,
    required: false
  }],
  category: {
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: "Category",
    required: true
  }
}, {
  timestamps: true
});
const Product = _mongoose.default.model("Product", ProductSchema);
var _default = exports.default = Product;