"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _multer = _interopRequireDefault(require("multer"));
var _path = _interopRequireDefault(require("path"));
var _fs = _interopRequireDefault(require("fs"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
// middlewares/multer.js

// Geçici yükleme klasörü (Cloudinary'ye göndermeden önce)
const uploadDir = "uploads/";
if (!_fs.default.existsSync(uploadDir)) {
  _fs.default.mkdirSync(uploadDir);
}
const storage = _multer.default.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // ./uploads/ klasörüne kaydeder
  },
  filename: (req, file, cb) => {
    const ext = _path.default.extname(file.originalname); // dosya uzantısını alır
    const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, filename);
  }
});
const upload = (0, _multer.default)({
  storage
});
var _default = exports.default = upload;