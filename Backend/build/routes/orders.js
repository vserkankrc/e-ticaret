"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = _interopRequireDefault(require("express"));
var _Products = _interopRequireDefault(require("../models/Products.js"));
var _PaymentSucces = _interopRequireDefault(require("../models/PaymentSucces.js"));
var _PaymentFaild = _interopRequireDefault(require("../models/PaymentFaild.js"));
var _SavedCard = _interopRequireDefault(require("../models/SavedCard.js"));
var _refundPayment = _interopRequireDefault(require("../services/iyzico/connection/refundPayment.js"));
var _Order = _interopRequireDefault(require("../models/Order.js"));
var _Reviews = _interopRequireDefault(require("../models/Reviews.js"));
var _createPayment = _interopRequireDefault(require("../services/iyzico/requests/createPayment.js"));
var _paySendEmail = require("../services/Email/paySendEmail.js");
var _cancelRequestEmail = require("../services/Email/cancelRequestEmail.js");
var _sendOrderCancelEmail = require("../services/Email/sendOrderCancelEmail.js");
var _auth = _interopRequireDefault(require("../middlewares/auth.js"));
var _adminMiddleware = _interopRequireDefault(require("../middlewares/adminMiddleware.js"));
var _nanoid = _interopRequireDefault(require("../utils/nanoid.js"));
var _logs = _interopRequireDefault(require("../utils/logs.js"));
var _Users = _interopRequireDefault(require("../models/Users.js"));
var _sendSms = require("../utils/sendSms.js");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
// <-- Burayı ekle

// kartlar için model
// ✅ isim düzeltildi

const router = _express.default.Router();

// === Ödeme ve Sipariş Oluşturma ===
router.post("/checkout", _auth.default, async (req, res) => {
  try {
    const user = req.user;
    const {
      products,
      totalAmount,
      trackingNumber,
      address,
      paymentMethod,
      agreementAccepted,
      card,
      saveCard
    } = req.body;
    console.log("➡️ Gelen ödeme verisi:", req.body);
    if (!products || !Array.isArray(products) || products.length === 0 || !address || !paymentMethod || agreementAccepted !== true) {
      return res.status(400).json({
        message: "Sipariş bilgileri eksik veya geçersiz."
      });
    }
    const registerCard = saveCard ? "1" : "0";
    const conversationId = (0, _nanoid.default)();
    const basketId = (0, _nanoid.default)();

    // 💳 KART VERİLERİ HAZIRLANIYOR
    let paymentCard = {};
    if (card?.savedCardId) {
      const savedCard = await _SavedCard.default.findById(card.savedCardId);
      if (!savedCard) {
        return res.status(400).json({
          message: "Kayıtlı kart bulunamadı."
        });
      }
      paymentCard = {
        cardUserKey: savedCard.cardUserKey,
        cardToken: savedCard.cardToken
      };
    } else {
      paymentCard = {
        cardHolderName: card.cardHolderName,
        cardNumber: card.cardNumber,
        expireMonth: card.expireMonth,
        expireYear: card.expireYear,
        cvc: card.cvc,
        registerCard
      };
    }
    const paymentData = {
      locale: "tr",
      conversationId,
      price: totalAmount.toString(),
      paidPrice: totalAmount.toString(),
      currency: "TRY",
      installment: "1",
      basketId,
      paymentChannel: "WEB",
      paymentGroup: "PRODUCT",
      paymentCard,
      buyer: {
        id: user._id.toString(),
        name: user.name,
        surname: user.surname,
        gsmNumber: user.phone,
        email: user.email,
        identityNumber: user.identityNumber || "11111111111",
        registrationAddress: address.addressDetail,
        ip: req.ip || "85.34.78.112",
        city: address.province,
        country: address.country || "Türkiye"
      },
      shippingAddress: {
        contactName: `${user.name} ${user.surname}`,
        city: address.province,
        country: address.country || "Türkiye",
        address: address.addressDetail
      },
      billingAddress: {
        contactName: `${user.name} ${user.surname}`,
        city: address.province,
        country: address.country || "Türkiye",
        address: address.addressDetail
      },
      basketItems: products.map(item => ({
        id: item.productId || (0, _nanoid.default)(),
        name: `${item.name || "Ürün"}${item.color ? " - " + item.color : ""}${item.size ? " - " + item.size : ""}`,
        category1: item.category || "Genel",
        itemType: "PHYSICAL",
        price: (item.price * item.quantity).toString()
      }))
    };
    const result = await (0, _createPayment.default)(paymentData);
    if (result.status?.toLowerCase() === "success") {
      // Yeni kartla ödeme yapıldıysa ve kart kaydedilecekse
      if (saveCard && !card.savedCardId && result.cardToken && result.cardUserKey) {
        await _SavedCard.default.create({
          userId: user._id,
          cardToken: result.cardToken,
          cardUserKey: result.cardUserKey,
          cardHolderName: card.cardHolderName,
          cardType: result.cardType || "Unknown",
          last4Digits: card.cardNumber.slice(-4),
          expireMonth: card.expireMonth,
          expireYear: card.expireYear
        });
      }

      // Ödeme başarılı oldu, stokları güncelle
      for (const item of products) {
        await _Products.default.findByIdAndUpdate(item.productId, {
          $inc: {
            quantity: -item.quantity
          }
        });
      }
      const paymentTransactionId = result.itemTransactions && result.itemTransactions.length > 0 ? result.itemTransactions[0].paymentTransactionId : "";

      // Siparişi kaydet – color ve size eklendi
      const savedOrder = await new _Order.default({
        userId: user._id,
        products: products.map((item, i) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          image: item.image || "",
          color: item.color || null,
          size: item.size || null,
          paymentTransactionId: result.itemTransactions?.[i]?.paymentTransactionId || ""
        })),
        paymentTransactionId,
        totalAmount,
        trackingNumber: trackingNumber || (0, _nanoid.default)(),
        address: {
          district: address.district,
          province: address.province,
          postalCode: address.postalCode,
          addressDetail: address.addressDetail,
          country: address.country || "Türkiye"
        },
        paymentMethod,
        agreementAccepted,
        paymentStatus: "completed",
        paymentId: result.paymentId || ""
      }).save();

      // Ödeme başarılı log kaydı
      await new _PaymentSucces.default({
        status: "success",
        conversationId,
        paymentId: result.paymentId || `PMT-${Date.now()}`,
        price: totalAmount,
        paidPrice: totalAmount,
        currency: "TRY",
        cartId: basketId,
        userId: user._id,
        itemTransactions: (result.itemTransactions || []).map((tx, i) => ({
          uid: `itm-${i}-${Date.now()}`,
          itemId: tx.itemId || products[i]?.productId,
          price: tx.price,
          paidPrice: tx.paidPrice,
          paymentTransactionId: tx.paymentTransactionId
        })),
        log: {
          message: "Ödeme başarılı.",
          userEmail: user.email,
          iyzicoRawResponse: result
        }
      }).save();

      // Başarı e-postası gönder
      await (0, _paySendEmail.sendPaymentSuccessEmail)({
        userName: user.name,
        userEmail: user.email,
        items: products.map(p => ({
          title: p.name,
          quantity: p.quantity
        })),
        totalPrice: totalAmount,
        currency: "TL"
      });

      // SMS gönderimi
      await (0, _sendSms.sendSms)({
        to: process.env.ADMIN_PHONE_NUMBER,
        message: `📦 Yeni sipariş alındı!\n👤 Müşteri: ${user.name}\n💰 Tutar: ₺${totalAmount}\n🛒 Ürün adedi: ${products.length}`
      });
      return res.status(201).json({
        message: "Ödeme başarılı. Sipariş oluşturuldu.",
        order: savedOrder,
        paymentResult: result
      });
    } else {
      throw new Error(result.errorMessage || "Ödeme başarısız.");
    }
  } catch (error) {
    console.error("Ödeme hatası:", error);
    await new _PaymentFaild.default({
      uid: (0, _nanoid.default)(),
      status: "failure",
      conversationId: (0, _nanoid.default)(),
      errorCode: error.code || "INTERNAL_ERROR",
      errorMessage: error.message || "Bilinmeyen ödeme hatası",
      log: {
        stack: error.stack,
        requestBody: req.body
      }
    }).save();
    return res.status(500).json({
      message: "Ödeme başarısız.",
      error: error.message
    });
  }
});

// Kayıtlı Kartları getirme
router.get("/cards", _auth.default, async (req, res) => {
  try {
    const userId = req.user._id; // authMiddleware'den geliyor

    // Kullanıcının kayıtlı kartlarını bul
    const cards = await _SavedCard.default.find({
      userId
    }).select("-__v -userId");
    res.status(200).json({
      success: true,
      cards
    });
  } catch (error) {
    console.error("Kartları getirme hatası:", error);
    res.status(500).json({
      success: false,
      message: "Kartlar getirilemedi."
    });
  }
});

// DELETE /api/cards/:cardId - Kullanıcının kendi kartını siler
router.delete("/:cardId", _auth.default, async (req, res) => {
  try {
    const userId = req.user._id;
    const {
      cardId
    } = req.params;

    // Kartı bul
    const card = await _SavedCard.default.findById(cardId);
    if (!card) {
      return res.status(404).json({
        message: "Kart bulunamadı."
      });
    }

    // Kullanıcı kontrolü
    if (card.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        message: "Bu karta erişim yetkiniz yok."
      });
    }

    // Kartı sil
    await card.deleteOne();
    return res.status(200).json({
      message: "Kart başarıyla silindi."
    });
  } catch (error) {
    console.error("Kart silme hatası:", error);
    return res.status(500).json({
      message: "Sunucu hatası."
    });
  }
});

// === Sipariş Listeleme (Kullanıcı) ===
router.get("/myorders", _auth.default, async (req, res) => {
  try {
    const userId = req.user._id;
    const page = parseInt(req.query.page) || 1; // Gelen sorgudan sayfa numarası, default 1
    const limit = parseInt(req.query.limit) || 5; // Sayfa başına kaç sipariş, default 5

    const skip = (page - 1) * limit;

    // Toplam sipariş sayısı (sayfa sayısı için)
    const totalOrders = await _Order.default.countDocuments({
      userId
    });

    // Siparişleri sayfalamalı çek
    const orders = await _Order.default.find({
      userId
    }).skip(skip).limit(limit).populate({
      path: "products.productId",
      select: "name images description"
    }).sort({
      createdAt: -1
    }); // İstersen en yeni siparişler önce

    // Favori kontrol, review kontrol vs... aynı şekilde devam

    const userReviews = await _Reviews.default.find({
      userId,
      status: "approved",
      productId: {
        $in: orders.flatMap(o => o.products.map(p => p.productId._id || p.productId))
      }
    }).select("productId");
    const reviewedProductIds = new Set(userReviews.map(r => r.productId.toString()));
    const ordersWithReviews = orders.map(order => ({
      ...order.toObject(),
      products: order.products.map(product => ({
        ...product.toObject(),
        name: product.productId?.name || "",
        image: product.productId?.images?.[0] || "",
        description: product.productId?.description || "",
        hasReviewed: reviewedProductIds.has(product.productId?._id?.toString()),
        productId: product.productId?._id || null
      }))
    }));
    res.status(200).json({
      orders: ordersWithReviews,
      page,
      totalPages: Math.ceil(totalOrders / limit),
      totalOrders
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Siparişleri çekerken hata oluştu."
    });
  }
});

// === Tüm Siparişleri Listeleme (Admin) - Sayfalama ile ===
router.get("/", _auth.default, _adminMiddleware.default, async (req, res) => {
  try {
    // Query param'dan sayfa numarası al (default 1)
    const page = parseInt(req.query.page) || 1;
    const limit = 5; // Sayfa başına 5 sipariş
    const skip = (page - 1) * limit;

    // Toplam kayıt sayısı (sayfa sayısını hesaplamak için)

    const totalOrders = await _Order.default.countDocuments();

    // Siparişleri çek, user bilgisini populate et
    const orders = await _Order.default.find().sort({
      createdAt: -1
    }).skip(skip).limit(limit).populate("userId", "email name").populate("products.productId", "name "); // ← BU SATIR ÖNEMLİ

    res.json({
      orders,
      page,
      totalPages: Math.ceil(totalOrders / limit),
      totalOrders
    });
  } catch (error) {
    console.error("Tüm siparişler hatası:", error);
    res.status(500).json({
      message: "Sunucu hatası"
    });
  }
});

// === Sipariş Durumu Güncelleme (Admin) ===
router.put("/:id/status", _auth.default, _adminMiddleware.default, async (req, res) => {
  try {
    const {
      status
    } = req.body;
    const order = await _Order.default.findById(req.params.id);
    if (!order) return res.status(404).json({
      message: "Sipariş bulunamadı"
    });
    if (!["hazırlanıyor", "kargoya verildi", "teslim edildi"].includes(status)) {
      return res.status(400).json({
        message: "Geçersiz sipariş durumu"
      });
    }
    order.status = status;
    await order.save();
    res.json({
      message: "Sipariş durumu güncellendi",
      order
    });
  } catch (error) {
    res.status(500).json({
      message: "Sunucu hatası"
    });
  }
});

/* Sipariş İptal işlemleri */

// Admin iptal onay ve iade süreci başlatma
router.post("/admin/cancel-order/:orderId", _auth.default, async (req, res) => {
  try {
    const orderId = req.params.orderId;

    // Yetki kontrolü (isteğe bağlı: admin mi?)
    if (!req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Yetkisiz erişim"
      });
    }
    const order = await _Order.default.findById(orderId);
    if (!order) return res.status(404).json({
      success: false,
      message: "Sipariş bulunamadı."
    });

    // Sipariş zaten iptal edilmiş mi?
    if (order.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Sipariş zaten iptal edilmiş."
      });
    }

    // İade isteği varsa ve ödeme yapılmışsa
    if (order.paymentTransactionId) {
      const refundResult = await (0, _refundPayment.default)({
        paymentTransactionId: order.paymentTransactionId,
        price: order.totalAmount,
        ip: req.ip || "85.34.78.112"
      });
      console.log("İade servisi cevabı:", refundResult);

      // PaymentSuccess güncelleme
      await _PaymentSucces.default.findOneAndUpdate({
        paymentId: order.paymentId
      }, {
        refundStatus: refundResult.status,
        refundTransactionId: refundResult.refundTransactionId || null,
        refundDate: new Date(),
        refundResponseLog: refundResult
      });
    }

    // Sipariş durumunu güncelle
    order.status = "cancelled";
    await order.save();
    return res.status(200).json({
      success: true,
      message: "Sipariş iptal edildi ve iade işlemi başlatıldı."
    });
  } catch (error) {
    console.error("İptal ve iade hatası:", error);

    // Hatalı refund durumunu logla
    await _PaymentSucces.default.findOneAndUpdate({
      paymentId: req.body.paymentId || "unknown"
    }, {
      refundStatus: "failed",
      refundResponseLog: error.response?.data || error.message || error
    });
    return res.status(500).json({
      success: false,
      message: "İade işlemi sırasında hata oluştu.",
      error: error.message
    });
  }
});

// İptal talebi bekleyen siparişler (cancelRequest: true)
router.get("/cancel-requests", _auth.default, _adminMiddleware.default, async (req, res) => {
  try {
    const pendingCancelOrders = await _Order.default.find({
      cancelRequest: true
    }).populate("userId", "name email") // Kullanıcı bilgilerini al
    .sort({
      createdAt: -1
    });
    console.log("İptal talebi bekleyen siparişler:", pendingCancelOrders);
    res.status(200).json({
      orders: pendingCancelOrders
    });
  } catch (error) {
    console.error("İptal talebi bekleyen siparişler alınırken hata:", error);
    res.status(500).json({
      message: "İptal talebi bekleyen siparişler alınamadı."
    });
  }
});

// Müşteriden gelen iptal talebi (cancelRequest: true yapılır)
router.post("/cancel-request/:orderId", _auth.default, async (req, res) => {
  try {
    const userId = req.user._id;
    const {
      orderId
    } = req.params;
    const order = await _Order.default.findOne({
      _id: orderId,
      userId
    });
    if (!order) {
      _logs.default.warn(`[${new Date().toISOString()}] ❌ Kullanıcı ${userId} için sipariş bulunamadı: ${orderId}`);
      return res.status(404).json({
        message: "Sipariş bulunamadı veya bu sipariş size ait değil."
      });
    }
    if (order.cancelRequest === true) {
      _logs.default.info(`[${new Date().toISOString()}] ⚠️ Kullanıcı ${userId} için zaten iptal talebi var: ${orderId}`);
      return res.status(400).json({
        message: "Bu sipariş için zaten bir iptal talebi mevcut."
      });
    }
    if (order.status === "cancelled") {
      _logs.default.info(`[${new Date().toISOString()}] ⚠️ Sipariş zaten iptal edilmiş: ${orderId}`);
      return res.status(400).json({
        message: "Bu sipariş zaten iptal edilmiş."
      });
    }
    order.cancelRequest = true;
    await order.save();
    const user = await _Users.default.findById(userId);
    try {
      await (0, _cancelRequestEmail.sendCancelRequestEmail)({
        userName: `${user.name} ${user.surname}`,
        userEmail: user.email,
        orderId: order._id
      });
      _logs.default.info(`[${new Date().toISOString()}] ✅ ${user.email} (${userId}) için iptal maili başarıyla gönderildi. Sipariş: ${orderId}`);
    } catch (emailErr) {
      _logs.default.error(`[${new Date().toISOString()}] ❌ ${user.email} için mail gönderilemedi. Hata: ${emailErr.message}`);
      console.error("Mail gönderilemedi:", emailErr);
    }
    return res.status(200).json({
      message: "İptal talebiniz alınmıştır.",
      order
    });
  } catch (error) {
    _logs.default.error(`[${new Date().toISOString()}] ❌ Genel hata: ${error.message}`);
    console.error("İptal talebi gönderilirken hata:", error);
    return res.status(500).json({
      message: "İptal talebi gönderilemedi."
    });
  }
});

//Admin tarafından sipariş iptali
router.post("/cancel-approve/:orderId", _adminMiddleware.default, async (req, res) => {
  let order = null;
  try {
    const {
      orderId
    } = req.params;
    order = await _Order.default.findById(orderId).populate("userId"); // user bilgisini alalım

    _logs.default.info(`[cancel-approve] Sipariş verisi getirildi: ${orderId}`);
    if (!order) {
      _logs.default.warn(`[cancel-approve] Sipariş bulunamadı: ${orderId}`);
      return res.status(404).json({
        message: "Sipariş bulunamadı"
      });
    }
    if (!order.cancelRequest) {
      _logs.default.warn(`[cancel-approve] İptal talebi yok: ${orderId}`);
      return res.status(400).json({
        message: "İptal talebi yok."
      });
    }
    const transactionId = order.paymentTransactionId || order.paymentId || null;
    _logs.default.info(`[cancel-approve] Kullanılacak transactionId: ${transactionId}`);
    if (!transactionId) {
      _logs.default.error(`[cancel-approve] Eksik transactionId, iade yapılamaz: ${orderId}`);
      return res.status(400).json({
        message: "Ödeme transaction ID bilgisi eksik."
      });
    }
    _logs.default.info(`[cancel-approve] İade edilecek tutar: ${order.totalAmount} - Sipariş: ${orderId}`);
    const refundResult = await (0, _refundPayment.default)({
      paymentTransactionId: transactionId,
      price: order.totalAmount,
      ip: req.ip || "85.34.78.112"
    });
    _logs.default.info(`[cancel-approve] İyzico iade cevabı: ${JSON.stringify(refundResult)}`);
    if (refundResult.status === "success") {
      _logs.default.info(`[cancel-approve] İade başarılı, veritabanı güncelleniyor: ${orderId}`);
      await _PaymentSucces.default.findOneAndUpdate({
        paymentId: transactionId
      }, {
        refundStatus: "success",
        refundTransactionId: refundResult.refundTransactionId || null,
        refundDate: new Date(),
        refundResponseLog: refundResult
      });
      order.status = "iptal edildi";
      order.cancelRequest = false;
      await order.save();

      // Mail gönder
      try {
        await (0, _sendOrderCancelEmail.sendOrderCancelEmail)({
          userName: `${order.userId.name} ${order.userId.surname || ""}`,
          userEmail: order.userId.email,
          orderId: order._id,
          totalAmount: order.totalAmount
        });
        _logs.default.info(`[cancel-approve] İptal ve iade maili gönderildi: ${order.userId.email}`);
      } catch (mailErr) {
        _logs.default.error(`[cancel-approve] Mail gönderilemedi: ${mailErr.message}`);
      }
      return res.status(200).json({
        message: "Sipariş iptal edildi ve iade yapıldı."
      });
    } else {
      _logs.default.error(`[cancel-approve] İade başarısız: ${JSON.stringify(refundResult)} - Sipariş: ${orderId}`);
      await _PaymentSucces.default.findOneAndUpdate({
        paymentId: transactionId
      }, {
        refundStatus: "failed",
        refundResponseLog: refundResult
      });
      return res.status(400).json({
        message: "İade işlemi başarısız.",
        details: refundResult
      });
    }
  } catch (error) {
    _logs.default.error(`[cancel-approve] İade hatası: ${error.message || error} - Sipariş: ${order ? order._id : "bilinmiyor"}`);
    if (order) {
      await _PaymentSucces.default.findOneAndUpdate({
        paymentId: order.paymentTransactionId || order.paymentId
      }, {
        refundStatus: "failed",
        refundResponseLog: error.response?.data || error.message || error
      });
    }
    return res.status(500).json({
      message: "Bir hata oluştu",
      error: error.message || error
    });
  }
});
var _default = exports.default = router;