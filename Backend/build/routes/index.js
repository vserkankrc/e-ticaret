"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = _interopRequireDefault(require("express"));
var _categories = _interopRequireDefault(require("./categories.js"));
var _products = _interopRequireDefault(require("./products.js"));
var _auth = _interopRequireDefault(require("./auth.js"));
var _test = _interopRequireDefault(require("./test.js"));
var _coupons = _interopRequireDefault(require("./coupons.js"));
var _reset = _interopRequireDefault(require("./reset.js"));
var _users = _interopRequireDefault(require("./users.js"));
var _favorite = _interopRequireDefault(require("./favorite.js"));
var _mail = _interopRequireDefault(require("./mail.js"));
var _orders = _interopRequireDefault(require("./orders.js"));
var _reviews = _interopRequireDefault(require("./reviews.js"));
var _pages = _interopRequireDefault(require("./pages.js"));
var _productQuestions = _interopRequireDefault(require("./productQuestions.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
// ✅ yeni eklenen satır

// yeni eklenen satır

const router = _express.default.Router();
router.use("/categories", _categories.default);
router.use("/products", _products.default);
router.use("/auth", _auth.default);
router.use("/check", _test.default);
router.use("/coupons", _coupons.default);
router.use("/forgot", _reset.default);
router.use("/users", _users.default);
router.use("/favorites", _favorite.default);
router.use("/mail", _mail.default);
router.use("/orders", _orders.default); // ✅ sipariş endpoint'i eklendi
router.use("/reviews", _reviews.default);
router.use("/pages", _pages.default); // yeni eklenen satır
router.use("/questions", _productQuestions.default);
var _default = exports.default = router;