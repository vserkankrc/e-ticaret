"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _ApiError = _interopRequireDefault(require("../error/ApiError.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
// Düzgün yazım

const GenericErrorHandler = (err, req, res, next) => {
  // Eğer hata ApiError değilse, konsola yazdır
  if (!(err instanceof _ApiError.default)) {
    console.error(err); // Hataları konsola yazdır
  }

  // Validation hatası mesajını temizle
  if (/\w+ validation failed: \w+/i.test(err.message)) {
    err.message = err.message.replace(/\w+ validation failed: \w+/i, "");
  }

  // Yanıtı gönder
  res.status(err.statusCode || 500).json({
    status: err.statusCode || 500,
    error: err.message || "Bir hata oluştu.",
    code: err.code || "INTERNAL_ERROR"
  });
};
var _default = exports.default = GenericErrorHandler;