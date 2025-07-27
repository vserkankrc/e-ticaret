"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = _interopRequireDefault(require("express"));
var _ProductQuestion = _interopRequireDefault(require("../models/ProductQuestion.js"));
var _Products = _interopRequireDefault(require("../models/Products.js"));
var _auth = _interopRequireDefault(require("../middlewares/auth.js"));
var _adminMiddleware = _interopRequireDefault(require("../middlewares/adminMiddleware.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const router = _express.default.Router();

// === Kullanıcı SORU SORAR ===
router.post("/:productId", _auth.default, async (req, res) => {
  try {
    const {
      question
    } = req.body;
    const {
      productId
    } = req.params;
    const userId = req.user._id;

    // Ürün kontrolü
    const product = await _Products.default.findById(productId);
    if (!product) {
      return res.status(404).json({
        message: "Ürün bulunamadı."
      });
    }
    const newQuestion = new _ProductQuestion.default({
      product: productId,
      user: userId,
      question
    });
    await newQuestion.save();
    res.status(201).json({
      success: true,
      message: "Soru gönderildi."
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Soru gönderilemedi.",
      error
    });
  }
});

// === ADMIN TÜM SORULARI GÖRÜR ===
router.get("/", _auth.default, _adminMiddleware.default, async (req, res) => {
  try {
    const questions = await _ProductQuestion.default.find().populate("user", "firstName lastName email").populate("product", "name");
    res.status(200).json({
      success: true,
      questions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Sorular alınamadı.",
      error
    });
  }
});

// === ADMIN SORUYU CEVAPLAYARAK GÜNCELLER ===
router.put("/:id/answer", _auth.default, _adminMiddleware.default, async (req, res) => {
  try {
    const {
      answer
    } = req.body;
    const question = await _ProductQuestion.default.findById(req.params.id);
    if (!question) {
      return res.status(404).json({
        message: "Soru bulunamadı."
      });
    }
    question.answer = answer;
    question.answeredAt = Date.now();
    await question.save();
    res.status(200).json({
      success: true,
      message: "Soru cevaplandı."
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Cevap eklenemedi.",
      error
    });
  }
});
var _default = exports.default = router;