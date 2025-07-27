"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const adminMiddleware = (req, res, next) => {
  // Token'ı cookie'den veya header'dan al
  const token = req.cookies.token || req.headers.authorization && req.headers.authorization.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      message: "Token bulunamadı."
    });
  }
  try {
    const decoded = _jsonwebtoken.default.verify(token, process.env.JWT_SECRET);

    // Kullanıcının admin olup olmadığını kontrol et
    if (decoded.role === "admin") {
      req.user = decoded; // kullanıcı bilgilerini request objesine ekle
      return next();
    } else {
      return res.status(403).json({
        message: "Admin yetkisi gerekli."
      });
    }
  } catch (error) {
    return res.status(401).json({
      message: "Token geçersiz."
    });
  }
};
var _default = exports.default = adminMiddleware;