"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = _interopRequireDefault(require("express"));
var _Favorite = _interopRequireDefault(require("../models/Favorite.js"));
var _auth = _interopRequireDefault(require("../middlewares/auth.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
// token kontrolü için

const router = _express.default.Router();

// Favori Ekle
router.post("/", _auth.default, async (req, res) => {
  const {
    productId
  } = req.body;
  const userId = req.user._id;
  const exists = await _Favorite.default.findOne({
    userId,
    productId
  });
  if (exists) return res.status(400).json({
    message: "Zaten favoride."
  });
  const favorite = new _Favorite.default({
    userId,
    productId
  });
  await favorite.save();
  res.status(201).json(favorite);
});

// Favoriden Kaldır
router.delete("/:productId", _auth.default, async (req, res) => {
  const {
    productId
  } = req.params;
  const userId = req.user._id;
  await _Favorite.default.findOneAndDelete({
    userId,
    productId
  });
  res.json({
    message: "Favoriden kaldırıldı."
  });
});

// Kullanıcının Favorileri
router.get("/", _auth.default, async (req, res) => {
  const favorites = await _Favorite.default.find({
    userId: req.user._id
  }).populate("productId");
  res.json(favorites);
});
var _default = exports.default = router;