"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
class ApiError extends Error {
  constructor(message, statusCode, code) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
  }
  static InternalServerError(message = "Sunucu hatası") {
    return new ApiError(message, 500, "INTERNAL_SERVER_ERROR");
  }
  static NotFound(message = "Bulunamadı") {
    return new ApiError(message, 404, "NOT_FOUND");
  }
  static BadRequest(message = "Geçersiz istek") {
    return new ApiError(message, 400, "BAD_REQUEST");
  }
  static Unauthorized(message = "Yetkisiz") {
    return new ApiError(message, 401, "UNAUTHORIZED");
  }
  static Forbidden(message = "Erişim reddedildi") {
    return new ApiError(message, 403, "FORBIDDEN");
  }
  static ValidationError(message = "Doğrulama hatası") {
    return new ApiError(message, 422, "VALIDATION_ERROR");
  }
  toJSON() {
    return {
      message: this.message,
      statusCode: this.statusCode,
      code: this.code,
      isOperational: this.isOperational
    };
  }
  logInfo() {
    return `[${this.code}] ${this.statusCode} - ${this.message}`;
  }
}
var _default = exports.default = ApiError;