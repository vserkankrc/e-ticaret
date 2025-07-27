"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = _interopRequireDefault(require("express"));
var _mongoose = _interopRequireDefault(require("mongoose"));
var _Products = _interopRequireDefault(require("../models/Products.js"));
var _ApiError = _interopRequireDefault(require("../error/ApiError.js"));
var _multer = _interopRequireDefault(require("../middlewares/multer.js"));
var _cloudinary = _interopRequireDefault(require("../services/iyzico/config/cloudinary.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
// Model yolu
// ApiError sınıfı
// Multer middleware (doğru path)
// Cloudinary config

const router = _express.default.Router();

// Get all products (Read - All)
router.get("/", async (req, res) => {
  try {
    const products = await _Products.default.find().populate("category", "name");
    res.status(200).json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      success: false,
      error: "Server error."
    });
  }
});

// Create a new product (Create)
router.post("/", async (req, res) => {
  try {
    const {
      name,
      price,
      description,
      discount = 0,
      images,
      colors = [],
      sizes = [],
      quantity,
      // ✅ stok adedi
      categoryId
    } = req.body;
    console.log("✅ Yeni Ürün Oluşturma İsteği Geldi:");
    console.log("İsim:", name);
    console.log("Fiyat:", price);
    console.log("Açıklama:", description);
    console.log("İndirim:", discount);
    console.log("Stok Adedi:", quantity); // ✅
    console.log("Görseller:", images);
    console.log("Renkler:", colors);
    console.log("Bedenler:", sizes);
    console.log("Kategori ID:", categoryId);

    // Validation
    if (!name || !price || !description || !categoryId || !Array.isArray(images) || images.length < 1) {
      throw new _ApiError.default("Zorunlu alanlar eksik veya hatalı.", 400);
    }
    if (typeof price !== "number" || price <= 0) {
      throw new _ApiError.default("Fiyat pozitif bir sayı olmalı.", 400);
    }
    const newProduct = new _Products.default({
      name,
      price,
      description,
      discount,
      quantity,
      // ✅ buraya da eklendi
      images,
      colors,
      sizes,
      category: categoryId
    });
    await newProduct.save();
    res.status(201).json({
      success: true,
      message: "Ürün başarıyla oluşturuldu.",
      data: newProduct
    });
  } catch (error) {
    console.error("❌ Ürün oluşturulurken hata:", error);
    if (error instanceof _ApiError.default) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
    }
    res.status(500).json({
      success: false,
      error: "Sunucu hatası."
    });
  }
});

// --- ÖNEMLİ ---
// ARAMA ROTASI BURADA OLMALI, DİNAMİK ROUTEDAN ÖNCE
router.get("/search", async (req, res) => {
  try {
    const query = req.query.query;
    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Arama terimi eksik."
      });
    }

    // Türkçe karakter desteği ve esnek eşleşme için normalize regex
    const regex = new RegExp(query.trim().replace(/i/g, "[iİIı]"), "i");
    const products = await _Products.default.find({
      $or: [{
        name: {
          $regex: regex
        }
      }, {
        description: {
          $regex: regex
        }
      }, {
        brand: {
          $regex: regex
        }
      }]
    }).limit(20);
    res.status(200).json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error("Arama hatası:", error);
    res.status(500).json({
      success: false,
      message: "Sunucu hatası"
    });
  }
});

// Get a single product by ID (Read - Single)
router.get("/:productId", async (req, res) => {
  try {
    const productId = req.params.productId;
    const product = await _Products.default.findById(productId).populate("category", "name"); // 👈 Burası eklendi

    if (!product) {
      throw new _ApiError.default("Product not found.", 404);
    }
    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    if (error instanceof _ApiError.default) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
    }
    res.status(500).json({
      success: false,
      error: "Server error."
    });
  }
});

// Update a product by ID (Update)
router.put("/:productId", async (req, res) => {
  try {
    const productId = req.params.productId;
    const updatedProduct = await _Products.default.findByIdAndUpdate(productId, req.body, {
      new: true
    });
    if (!updatedProduct) {
      throw new _ApiError.default("Product not found.", 404);
    }
    res.status(200).json({
      success: true,
      message: "Product updated successfully.",
      data: updatedProduct
    });
  } catch (error) {
    console.error("Error updating product:", error);
    if (error instanceof _ApiError.default) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
    }
    res.status(500).json({
      success: false,
      error: "Server error."
    });
  }
});

// Delete a product by ID (Delete)
router.delete("/:productId", async (req, res) => {
  try {
    const productId = req.params.productId;
    const deletedProduct = await _Products.default.findByIdAndDelete(productId);
    if (!deletedProduct) {
      throw new _ApiError.default("Product not found.", 404);
    }
    res.status(200).json({
      success: true,
      message: "Product deleted successfully.",
      data: deletedProduct
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    if (error instanceof _ApiError.default) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
    }
    res.status(500).json({
      success: false,
      error: "Server error."
    });
  }
});

// Görsel yükleme endpoint'i (multer + cloudinary)
router.post("/upload-image", _multer.default.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(401).json({
        success: false,
        error: "Görsel dosyası bulunamadı."
      });
    }
    const result = await _cloudinary.default.uploader.upload(req.file.path, {
      folder: "products",
      resource_type: "image"
    });
    res.status(201).json({
      success: true,
      url: result.secure_url
    });
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    res.status(500).json({
      success: false,
      error: "Görsel yüklenirken hata oluştu."
    });
  }
});

// GET /api/products → belirli kategoriye ait ürünler
router.get("/categories/:categoryId", async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    if (!_mongoose.default.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({
        success: false,
        error: "Geçersiz kategori ID."
      });
    }
    const products = await _Products.default.find({
      category: categoryId
    }).populate("category", "name");
    res.status(200).json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error("Error fetching products by category:", error);
    res.status(500).json({
      success: false,
      error: "Server error."
    });
  }
});
var _default = exports.default = router;