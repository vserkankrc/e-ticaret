"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _cloudinary = require("cloudinary");
var _dotenv = _interopRequireDefault(require("dotenv"));
var _path = _interopRequireDefault(require("path"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
// .env dosyasının tam yolunu ver
_dotenv.default.config({
  path: _path.default.resolve("env/.dev") // veya "backend/env/.dev" şeklinde olabilir
});
_cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});
console.log('Cloud name:', process.env.CLOUDINARY_CLOUD_NAME);
console.log('API key:', process.env.CLOUDINARY_API_KEY);
console.log('API secret:', process.env.CLOUDINARY_API_SECRET);
var _default = exports.default = _cloudinary.v2;