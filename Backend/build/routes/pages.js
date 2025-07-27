"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = require("express");
var _Pages = _interopRequireDefault(require("../models/Pages.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const router = (0, _express.Router)();

// Sayfa listesini getir (GET /api/pages)
router.get("/", async (req, res) => {
  try {
    const pages = await _Pages.default.find().sort({
      createdAt: -1
    });
    res.json({
      success: true,
      data: pages
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Sayfalar alınamadı",
      error
    });
  }
});

// Slug veya ID ile tek sayfa getir (GET /api/pages/:idOrSlug)
router.get("/:idOrSlug", async (req, res) => {
  try {
    const {
      idOrSlug
    } = req.params;
    let page = null;
    if (idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
      page = await _Pages.default.findById(idOrSlug);
    }
    if (!page) {
      page = await _Pages.default.findOne({
        slug: idOrSlug
      });
    }
    if (!page) {
      return res.status(404).json({
        success: false,
        message: "Sayfa bulunamadı"
      });
    }
    res.json({
      success: true,
      data: page
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Sayfa getirilemedi",
      error
    });
  }
});

// Yeni sayfa oluştur (POST /api/pages)
router.post("/", async (req, res) => {
  try {
    const {
      slug,
      title,
      content
    } = req.body;
    if (!slug || !title || !content) {
      return res.status(400).json({
        success: false,
        message: "Tüm alanlar zorunludur"
      });
    }

    // Aynı slug var mı kontrol et
    const existing = await _Pages.default.findOne({
      slug
    });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Slug zaten kullanılıyor"
      });
    }
    const newPage = new _Pages.default({
      slug,
      title,
      content
    });
    await newPage.save();
    res.status(201).json({
      success: true,
      data: newPage
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Sayfa oluşturulamadı",
      error
    });
  }
});

// Sayfa güncelle (PUT /api/pages/:id)
router.put("/:id", async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const {
      slug,
      title,
      content
    } = req.body;
    if (!slug || !title || !content) {
      return res.status(400).json({
        success: false,
        message: "Tüm alanlar zorunludur"
      });
    }

    // Slug başka sayfada mı kontrol et
    const existing = await _Pages.default.findOne({
      slug,
      _id: {
        $ne: id
      }
    });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Slug zaten kullanılıyor"
      });
    }
    const updatedPage = await _Pages.default.findByIdAndUpdate(id, {
      slug,
      title,
      content
    }, {
      new: true
    });
    if (!updatedPage) {
      return res.status(404).json({
        success: false,
        message: "Sayfa bulunamadı"
      });
    }
    res.json({
      success: true,
      data: updatedPage
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Sayfa güncellenemedi",
      error
    });
  }
});

// Sayfa sil (DELETE /api/pages/:id)
router.delete("/:id", async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const deleted = await _Pages.default.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Sayfa bulunamadı"
      });
    }
    res.json({
      success: true,
      message: "Sayfa silindi"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Sayfa silinemedi",
      error
    });
  }
});
var _default = exports.default = router;