"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _mongoose = require("mongoose");
// models/Pages.js

const PagesSchema = new _mongoose.Schema({
  slug: {
    type: String,
    required: true,
    unique: true // URL için benzersiz slug (örneğin: "terms-of-use", "privacy-policy")
  },
  title: {
    type: String,
    required: true // sayfa başlığı
  },
  content: {
    type: String,
    required: true // sayfa içeriği (HTML veya markdown formatında olabilir)
  }
}, {
  timestamps: true // createdAt, updatedAt otomatik eklenir
});
var _default = exports.default = (0, _mongoose.model)("Pages", PagesSchema);