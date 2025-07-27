"use strict";

var _iyzipay = _interopRequireDefault(require("iyzipay"));
var Cards = _interopRequireWildcard(require("./methods/cards"));
var Installments = _interopRequireWildcard(require("./methods/installments"));
var payments = _interopRequireWildcard(require("./methods/payments"));
var PaymentsThreeDS = _interopRequireWildcard(require("./methods/threeds-payments"));
var Checkouts = _interopRequireWildcard(require("./methods/checkouts"));
var CancelPayments = _interopRequireWildcard(require("./methods/cancel-payments"));
var RefundPayments = _interopRequireWildcard(require("./methods/refund-payments"));
var _nanoid = _interopRequireDefault(require("../../utils/nanoid"));
var Logs = _interopRequireWildcard(require("../../utils/logs"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/* ------------------------------------- */
/*  A) CARDS            */
/* ------------------------------------- */

//Bir kullanıcı ve kart oluştur
const createUserAndCards = () => {
  Cards.createUserCard({
    locale: _iyzipay.default.LOCALE.TR,
    conversationId: (0, _nanoid.default)(),
    email: "email@email.com",
    expternalId: (0, _nanoid.default)(),
    card: {
      cardAlias: "Kredi Kartım",
      cardHolderName: "Jhon Doe",
      cardNumber: "5528790000000008",
      expireMonth: "12",
      expireYear: "2030"
    }
  }).then(result => {
    console.log(result);
    Logs.logFile("1-cards-kullanıcı-ve-kart-oluştur", result);
  }).catch(err => {
    console.log(err);
    Logs.logFile("1-cards-kullanıcı-ve-kart-oluştur-hata", err);
  });
};

/* createUserAndCards() */

//Bir kullanıcıya yeni kart ekle

const createACardForAUser = () => {
  Cards.createUserCard({
    locale: _iyzipay.default.LOCALE.TR,
    conversationId: (0, _nanoid.default)(),
    email: "email@email.com",
    expternalId: (0, _nanoid.default)(),
    //CardUserKey kullanıcının ID 'si
    cardUserKey: "23e14af3-d7dc-7ee2-755c-629c0d36ecd8",
    card: {
      cardAlias: "Kredi Kartım",
      cardHolderName: "Jhon Doe",
      cardNumber: "5528790000000008",
      expireMonth: "12",
      expireYear: "2030"
    }
  }).then(result => {
    console.log(result);
    Logs.logFile("2-cards-bir-kullanıcıya-kart-ekle", result);
  }).catch(err => {
    console.log(err);
    Logs.logFile("2-cards-bir-kullanıcıya-kart-ekle-hata", err);
  });
};
/* createACardForAUser() */

//Bir kullanıcının kartlarını oku

const readCardsOfAUser = () => {
  Cards.getUserCards({
    locale: _iyzipay.default.LOCALE.TR,
    conversationId: (0, _nanoid.default)(),
    //CardUserKey kullanıcının ID 'si
    cardUserKey: "23e14af3-d7dc-7ee2-755c-629c0d36ecd8"
  }).then(result => {
    console.log(result);
    Logs.logFile("3-cards-bir-kullanıcının-kartlarını-oku", result);
  }).catch(err => {
    console.log(err);
    Logs.logFile("3-cards-bir-kullanıcının-kartlarını-oku-hata", err);
  });
};

/* readCardsOfAUser() */

//Bir kullanıcının kartını sil

const deleteACardOfAUser = () => {
  Cards.deleteCard({
    locale: _iyzipay.default.LOCALE.TR,
    conversationId: (0, _nanoid.default)(),
    //CardUserKey kullanıcının ID 'si
    cardUserKey: "23e14af3-d7dc-7ee2-755c-629c0d36ecd8",
    //CardKey kartın ID 'si
    cardToken: "b88caab0-4495-4656-788a-976395f25f89"
  }).then(result => {
    console.log(result);
    Logs.logFile("4-cards-bir-kullanıcının-kartını-sil", result);
  }).catch(err => {
    console.log(err);
    Logs.logFile("4-cards-bir-kullanıcının-kartını-sil-hata", err);
  });
};

/* deleteACardOfAUser(); */
/* readCardsOfAUser(); */

/* ------------------------------------- */
/*  B) INSTALMENTS            */
/* ------------------------------------- */

//Bir kart ve ücretle ilgili gerçeklebilecek taksitlerin kontrolü

const checkInstallments = () => {
  return Installments.checkInstallment({
    locale: _iyzipay.default.LOCALE.TR,
    conversationId: (0, _nanoid.default)(),
    //binNumber Taksit sayısını belirtir.
    binNumber: "55287900",
    price: "1000"
  }).then(result => {
    console.log(result);
    Logs.logFile("5-installments-bir-kart-ve-ucret-taksit-kontrolu", result);
  }).catch(err => {
    console.log(err);
    Logs.logFile("5-installments-bir-kart-ve-ucret-taksit-kontrolu-hata", err);
  });
};

/* checkInstallments() */

/* ------------------------------------- */
/*  C) NORMAL PAYMENTS            */
/* ------------------------------------- */

//Kayıtlı olmayan kartla ödeme yapmak ve kaydetme

const createPayment = () => {
  return payments.createPayment({
    locale: _iyzipay.default.LOCALE.TR,
    covarsationId: (0, _nanoid.default)(),
    price: "300",
    paidPrice: "300",
    currency: _iyzipay.default.CURRENCY.TRY,
    installment: "1",
    basketId: "BASKET-1",
    paymentChannel: _iyzipay.default.PAYMENT_CHANNEL.WEB,
    paymentGroup: _iyzipay.default.PAYMENT_GROUP.PRODUCT,
    paymentCard: {
      cardHolderName: "Jhon Doe",
      cardNumber: "5528790000000008",
      expireMonth: "12",
      expireYear: "2030",
      cvc: "123",
      registerCard: "0"
    },
    buyer: {
      id: "B-1",
      name: "Jhon Doe",
      surname: "Doe",
      email: "johndoe@example.com",
      gsmNumber: "+905333333333",
      identityNumber: "743008664791",
      lastLoginDate: "2025-01-15 18:55:37",
      registrationDate: "2025-01-13 18:55:37",
      registrationAddress: "Nidakule Göztepe, Hayrettin Karakurt Sok. No 22",
      ip: "85.199.182.140",
      city: "istanbul",
      country: "Turkey",
      zipCode: "34722"
    },
    shippingAddress: {
      contactName: "Jhon Doe",
      city: "Istanbul",
      country: "Turkey",
      address: "Nidakule Göztepe, Hayrettin Karakurt Sok. No 22",
      zipCode: "34722"
    },
    billingAddress: {
      contactName: "Jhon Doe",
      city: "Istanbul",
      country: "Turkey",
      address: "Nidakule Göztepe, Hayrettin Karakurt Sok. No 22",
      zipCode: "34722"
    },
    basketItems: [{
      id: "BI-1",
      price: "90",
      name: "Product 1",
      quantity: 1,
      category1: "Electronics",
      category2: "Smartphones",
      itemType: _iyzipay.default.BASKET_ITEM_TYPE.PHYSICAL
    }, {
      id: "BI-13",
      price: "150",
      name: "Product 1",
      quantity: 1,
      category1: "Electronics",
      category2: "Smartphones",
      itemType: _iyzipay.default.BASKET_ITEM_TYPE.PHYSICAL
    }, {
      id: "BI-12",
      price: "60",
      name: "Product 1",
      quantity: 1,
      category1: "Electronics",
      category2: "Smartphones",
      itemType: _iyzipay.default.BASKET_ITEM_TYPE.PHYSICAL
    }]
  }).then(result => {
    console.log(result);
    Logs.logFile("6-payments-yeni-bir-kartla-ödeme-al-ve-kartı-kaydetme", result);
  }).catch(err => {
    console.log(err);
    Logs.logFile("6-payments-yeni-bir-kartla-ödeme-al-ve-kartı-kaydetme-hata", err);
  });
};
/* createPayment() */

//Bir kredi kartı ile ödeme yap ve kartı kaydet

const createPaymentAndSaveCard = () => {
  return payments.createPayment({
    locale: _iyzipay.default.LOCALE.TR,
    covarsationId: (0, _nanoid.default)(),
    price: "300",
    paidPrice: "300",
    currency: _iyzipay.default.CURRENCY.TRY,
    installment: "1",
    basketId: "BASKET-1",
    paymentChannel: _iyzipay.default.PAYMENT_CHANNEL.WEB,
    paymentGroup: _iyzipay.default.PAYMENT_GROUP.PRODUCT,
    paymentCard: {
      cardUserKey: "23e14af3-d7dc-7ee2-755c-629c0d36ecd8",
      cardAlias: "Kredi Kartım ödemeden sonra",
      cardHolderName: "Jhon Doe",
      cardNumber: "5528790000000008",
      expireMonth: "12",
      expireYear: "2030",
      cvc: "123",
      registerCard: "1"
    },
    buyer: {
      id: "B-1",
      name: "Jhon Doe",
      surname: "Doe",
      email: "johndoe@example.com",
      gsmNumber: "+905333333333",
      identityNumber: "743008664791",
      lastLoginDate: "2025-01-15 18:55:37",
      registrationDate: "2025-01-13 18:55:37",
      registrationAddress: "Nidakule Göztepe, Hayrettin Karakurt Sok. No 22",
      ip: "85.199.182.140",
      city: "istanbul",
      country: "Turkey",
      zipCode: "34722"
    },
    shippingAddress: {
      contactName: "Jhon Doe",
      city: "Istanbul",
      country: "Turkey",
      address: "Nidakule Göztepe, Hayrettin Karakurt Sok. No 22",
      zipCode: "34722"
    },
    billingAddress: {
      contactName: "Jhon Doe",
      city: "Istanbul",
      country: "Turkey",
      address: "Nidakule Göztepe, Hayrettin Karakurt Sok. No 22",
      zipCode: "34722"
    },
    basketItems: [{
      id: "BI-1",
      price: "90",
      name: "Product 1",
      quantity: 1,
      category1: "Electronics",
      category2: "Smartphones",
      itemType: _iyzipay.default.BASKET_ITEM_TYPE.PHYSICAL
    }, {
      id: "BI-13",
      price: "150",
      name: "Product 1",
      quantity: 1,
      category1: "Electronics",
      category2: "Smartphones",
      itemType: _iyzipay.default.BASKET_ITEM_TYPE.PHYSICAL
    }, {
      id: "BI-12",
      price: "60",
      name: "Product 1",
      quantity: 1,
      category1: "Electronics",
      category2: "Smartphones",
      itemType: _iyzipay.default.BASKET_ITEM_TYPE.PHYSICAL
    }]
  }).then(result => {
    console.log(result);
    Logs.logFile("7-payments-yeni-bir-kartla-ödeme-al-ve-kartı-kaydet", result);
  }).catch(err => {
    console.log(err);
    Logs.logFile("7-payments-yeni-bir-kartla-ödeme-al-ve-kartı-kaydet-hata", err);
  });
};

/* createPaymentAndSaveCard(); */
/* readCardsOfAUser() */

// Bir kayıtlı kart ile ödeme alma

const createPaymentWithSavedCard = () => {
  return payments.createPayment({
    locale: _iyzipay.default.LOCALE.TR,
    covarsationId: (0, _nanoid.default)(),
    price: "300",
    paidPrice: "300",
    currency: _iyzipay.default.CURRENCY.TRY,
    installment: "1",
    basketId: "BASKET-1",
    paymentChannel: _iyzipay.default.PAYMENT_CHANNEL.WEB,
    paymentGroup: _iyzipay.default.PAYMENT_GROUP.PRODUCT,
    paymentCard: {
      cardUserKey: "23e14af3-d7dc-7ee2-755c-629c0d36ecd8",
      cardToken: "daf46a0c-2086-9b77-244a-ea5dafccb792"
    },
    buyer: {
      id: "B-1",
      name: "Jhon Doe",
      surname: "Doe",
      email: "johndoe@example.com",
      gsmNumber: "+905333333333",
      identityNumber: "743008664791",
      lastLoginDate: "2025-01-15 18:55:37",
      registrationDate: "2025-01-13 18:55:37",
      registrationAddress: "Nidakule Göztepe, Hayrettin Karakurt Sok. No 22",
      ip: "85.199.182.140",
      city: "istanbul",
      country: "Turkey",
      zipCode: "34722"
    },
    shippingAddress: {
      contactName: "Jhon Doe",
      city: "Istanbul",
      country: "Turkey",
      address: "Nidakule Göztepe, Hayrettin Karakurt Sok. No 22",
      zipCode: "34722"
    },
    billingAddress: {
      contactName: "Jhon Doe",
      city: "Istanbul",
      country: "Turkey",
      address: "Nidakule Göztepe, Hayrettin Karakurt Sok. No 22",
      zipCode: "34722"
    },
    basketItems: [{
      id: "BI-1",
      price: "90",
      name: "Product 1",
      quantity: 1,
      category1: "Electronics",
      category2: "Smartphones",
      itemType: _iyzipay.default.BASKET_ITEM_TYPE.PHYSICAL
    }, {
      id: "BI-13",
      price: "150",
      name: "Product 1",
      quantity: 1,
      category1: "Electronics",
      category2: "Smartphones",
      itemType: _iyzipay.default.BASKET_ITEM_TYPE.PHYSICAL
    }, {
      id: "BI-12",
      price: "60",
      name: "Product 1",
      quantity: 1,
      category1: "Electronics",
      category2: "Smartphones",
      itemType: _iyzipay.default.BASKET_ITEM_TYPE.PHYSICAL
    }]
  }).then(result => {
    console.log(result);
    Logs.logFile("8-payments-kayıtlı-bir-kartla-ödeme-al", result);
  }).catch(err => {
    console.log(err);
    Logs.logFile("8-payments-kayıtlı-bir-kartla-ödeme-al-hata", err);
  });
};
/* createPaymentWithSavedCard() */

/* ------------------------------------- */
/*  D) 3D Secure Payments            */
/* ------------------------------------- */

const initializeThreeDSPayments = () => {
  PaymentsThreeDS.initializePayment({
    locale: _iyzipay.default.LOCALE.TR,
    covarsationId: (0, _nanoid.default)(),
    price: "300",
    paidPrice: "300",
    currency: _iyzipay.default.CURRENCY.TRY,
    installment: "1",
    basketId: "BASKET-1",
    paymentChannel: _iyzipay.default.PAYMENT_CHANNEL.WEB,
    paymentGroup: _iyzipay.default.PAYMENT_GROUP.PRODUCT,
    callbackUrl: "https://localhost/api/payment/3ds/complete",
    paymentCard: {
      cardHolderName: "Jhon Doe",
      cardNumber: "5528790000000008",
      expireMonth: "12",
      expireYear: "2030",
      cvc: "123",
      registerCard: "0"
    },
    buyer: {
      id: "B-1",
      name: "Jhon Doe",
      surname: "Doe",
      email: "johndoe@example.com",
      gsmNumber: "+905333333333",
      identityNumber: "743008664791",
      lastLoginDate: "2025-01-15 18:55:37",
      registrationDate: "2025-01-13 18:55:37",
      registrationAddress: "Nidakule Göztepe, Hayrettin Karakurt Sok. No 22",
      ip: "85.199.182.140",
      city: "istanbul",
      country: "Turkey",
      zipCode: "34722"
    },
    shippingAddress: {
      contactName: "Jhon Doe",
      city: "Istanbul",
      country: "Turkey",
      address: "Nidakule Göztepe, Hayrettin Karakurt Sok. No 22",
      zipCode: "34722"
    },
    billingAddress: {
      contactName: "Jhon Doe",
      city: "Istanbul",
      country: "Turkey",
      address: "Nidakule Göztepe, Hayrettin Karakurt Sok. No 22",
      zipCode: "34722"
    },
    basketItems: [{
      id: "BI-1",
      price: "90",
      name: "Product 1",
      quantity: 1,
      category1: "Electronics",
      category2: "Smartphones",
      itemType: _iyzipay.default.BASKET_ITEM_TYPE.PHYSICAL
    }, {
      id: "BI-13",
      price: "150",
      name: "Product 1",
      quantity: 1,
      category1: "Electronics",
      category2: "Smartphones",
      itemType: _iyzipay.default.BASKET_ITEM_TYPE.PHYSICAL
    }, {
      id: "BI-12",
      price: "60",
      name: "Product 1",
      quantity: 1,
      category1: "Electronics",
      category2: "Smartphones",
      itemType: _iyzipay.default.BASKET_ITEM_TYPE.PHYSICAL
    }]
  }).then(result => {
    console.log(result);
    Logs.logFile("9-threeds-payments-yeni-bir-kartla-ödeme-al", result);
  }).catch(err => {
    console.log(err);
    Logs.logFile("9-threeds-payments-yeni-bir-kartla-ödeme-al-hata", err);
  });
};

/* initializeThreeDSPayments() */

// 3DS Ödemesini tamamla
const completeThreeDSPayment = () => {
  PaymentsThreeDS.completePayment({
    locale: _iyzipay.default.LOCALE.TR,
    conversationId: (0, _nanoid.default)(),
    paymentId: "23400594",
    conversationData: "conversation Data"
  }).then(result => {
    console.log(result);
    Logs.logFile("10-threeds-payments-ödeme-tamamla", result);
  }).catch(err => {
    console.log(err);
    Logs.logFile("10-threeds-payments-ödeme-tamamla-hata", err);
  });
};
/* completeThreeDSPayment() */

//3DS ödemesini hali hazırda olan bir kartla yap

const initializeThreeDSPaymentsWithRegisteredCard = () => {
  PaymentsThreeDS.initializePayment({
    locale: _iyzipay.default.LOCALE.TR,
    covarsationId: (0, _nanoid.default)(),
    price: "300",
    paidPrice: "300",
    currency: _iyzipay.default.CURRENCY.TRY,
    installment: "1",
    basketId: "BASKET-1",
    paymentChannel: _iyzipay.default.PAYMENT_CHANNEL.WEB,
    paymentGroup: _iyzipay.default.PAYMENT_GROUP.PRODUCT,
    callbackUrl: "https://localhost/api/payment/3ds/complete",
    paymentCard: {
      cardUserKey: "23e14af3-d7dc-7ee2-755c-629c0d36ecd8",
      cardToken: "daf46a0c-2086-9b77-244a-ea5dafccb792"
    },
    buyer: {
      id: "B-1",
      name: "Jhon Doe",
      surname: "Doe",
      email: "johndoe@example.com",
      gsmNumber: "+905333333333",
      identityNumber: "743008664791",
      lastLoginDate: "2025-01-15 18:55:37",
      registrationDate: "2025-01-13 18:55:37",
      registrationAddress: "Nidakule Göztepe, Hayrettin Karakurt Sok. No 22",
      ip: "85.199.182.140",
      city: "istanbul",
      country: "Turkey",
      zipCode: "34722"
    },
    shippingAddress: {
      contactName: "Jhon Doe",
      city: "Istanbul",
      country: "Turkey",
      address: "Nidakule Göztepe, Hayrettin Karakurt Sok. No 22",
      zipCode: "34722"
    },
    billingAddress: {
      contactName: "Jhon Doe",
      city: "Istanbul",
      country: "Turkey",
      address: "Nidakule Göztepe, Hayrettin Karakurt Sok. No 22",
      zipCode: "34722"
    },
    basketItems: [{
      id: "BI-1",
      price: "90",
      name: "Product 1",
      quantity: 1,
      category1: "Electronics",
      category2: "Smartphones",
      itemType: _iyzipay.default.BASKET_ITEM_TYPE.PHYSICAL
    }, {
      id: "BI-13",
      price: "150",
      name: "Product 1",
      quantity: 1,
      category1: "Electronics",
      category2: "Smartphones",
      itemType: _iyzipay.default.BASKET_ITEM_TYPE.PHYSICAL
    }, {
      id: "BI-12",
      price: "60",
      name: "Product 1",
      quantity: 1,
      category1: "Electronics",
      category2: "Smartphones",
      itemType: _iyzipay.default.BASKET_ITEM_TYPE.PHYSICAL
    }]
  }).then(result => {
    console.log(result);
    Logs.logFile("11-threeds-payments-kayıtlı-bir-kart", result);
  }).catch(err => {
    console.log(err);
    Logs.logFile("11-threeds-payments-kayıtlı-bir-kart-hata", err);
  });
};

/* initializeThreeDSPaymentsWithRegisteredCard(); */

// 3DS ödeme yap ve kartı kaydet

const initializeThreeDSPaymentsWithNewCardAndRegister = () => {
  PaymentsThreeDS.initializePayment({
    locale: _iyzipay.default.LOCALE.TR,
    covarsationId: (0, _nanoid.default)(),
    price: "300",
    paidPrice: "300",
    currency: _iyzipay.default.CURRENCY.TRY,
    installment: "1",
    basketId: "BASKET-1",
    paymentChannel: _iyzipay.default.PAYMENT_CHANNEL.WEB,
    paymentGroup: _iyzipay.default.PAYMENT_GROUP.PRODUCT,
    callbackUrl: "https://localhost/api/payment/3ds/complete",
    paymentCard: {
      cardUserKey: "23e14af3-d7dc-7ee2-755c-629c0d36ecd8",
      cardAlias: "Kredi Kartım ödemeden sonra",
      cardHolderName: "Jhon Doe",
      cardNumber: "5528790000000008",
      expireMonth: "12",
      expireYear: "2030",
      cvc: "123",
      registerCard: "1"
    },
    buyer: {
      id: "B-1",
      name: "Jhon Doe",
      surname: "Doe",
      email: "johndoe@example.com",
      gsmNumber: "+905333333333",
      identityNumber: "743008664791",
      lastLoginDate: "2025-01-15 18:55:37",
      registrationDate: "2025-01-13 18:55:37",
      registrationAddress: "Nidakule Göztepe, Hayrettin Karakurt Sok. No 22",
      ip: "85.199.182.140",
      city: "istanbul",
      country: "Turkey",
      zipCode: "34722"
    },
    shippingAddress: {
      contactName: "Jhon Doe",
      city: "Istanbul",
      country: "Turkey",
      address: "Nidakule Göztepe, Hayrettin Karakurt Sok. No 22",
      zipCode: "34722"
    },
    billingAddress: {
      contactName: "Jhon Doe",
      city: "Istanbul",
      country: "Turkey",
      address: "Nidakule Göztepe, Hayrettin Karakurt Sok. No 22",
      zipCode: "34722"
    },
    basketItems: [{
      id: "BI-1",
      price: "90",
      name: "Product 1",
      quantity: 1,
      category1: "Electronics",
      category2: "Smartphones",
      itemType: _iyzipay.default.BASKET_ITEM_TYPE.PHYSICAL
    }, {
      id: "BI-13",
      price: "150",
      name: "Product 1",
      quantity: 1,
      category1: "Electronics",
      category2: "Smartphones",
      itemType: _iyzipay.default.BASKET_ITEM_TYPE.PHYSICAL
    }, {
      id: "BI-12",
      price: "60",
      name: "Product 1",
      quantity: 1,
      category1: "Electronics",
      category2: "Smartphones",
      itemType: _iyzipay.default.BASKET_ITEM_TYPE.PHYSICAL
    }]
  }).then(result => {
    console.log(result);
    Logs.logFile("12-threeds-payments-yeni-bir-kart-kaydet", result);
  }).catch(err => {
    console.log(err);
    Logs.logFile("12-threeds-payments-yeni-bir-kart-kaydet-hata", err);
  });
};

/* initializeThreeDSPaymentsWithNewCardAndRegister() */

/* readCardsOfAUser() */

/* ------------------------------------- */
/*  E) Checkout From            */
/* ------------------------------------- */

//Checkout from içerisinde ödeme başlat

const initializeCheckoutFrom = () => {
  Checkouts.initialize({
    locale: _iyzipay.default.LOCALE.TR,
    covarsationId: (0, _nanoid.default)(),
    price: "300",
    paidPrice: "300",
    currency: _iyzipay.default.CURRENCY.TRY,
    installment: "1",
    basketId: "BASKET-1",
    paymentChannel: _iyzipay.default.PAYMENT_CHANNEL.WEB,
    paymentGroup: _iyzipay.default.PAYMENT_GROUP.PRODUCT,
    callbackUrl: "https://localhost/api/checkout/3ds/complete/payment",
    cardUserKey: "23e14af3-d7dc-7ee2-755c-629c0d36ecd8",
    enabledInstallments: [1, 2, 3, 6, 9],
    buyer: {
      id: "B-1",
      name: "Jhon Doe",
      surname: "Doe",
      email: "johndoe@example.com",
      gsmNumber: "+905333333333",
      identityNumber: "743008664791",
      lastLoginDate: "2025-01-15 18:55:37",
      registrationDate: "2025-01-13 18:55:37",
      registrationAddress: "Nidakule Göztepe, Hayrettin Karakurt Sok. No 22",
      ip: "85.199.182.140",
      city: "istanbul",
      country: "Turkey",
      zipCode: "34722"
    },
    shippingAddress: {
      contactName: "Jhon Doe",
      city: "Istanbul",
      country: "Turkey",
      address: "Nidakule Göztepe, Hayrettin Karakurt Sok. No 22",
      zipCode: "34722"
    },
    billingAddress: {
      contactName: "Jhon Doe",
      city: "Istanbul",
      country: "Turkey",
      address: "Nidakule Göztepe, Hayrettin Karakurt Sok. No 22",
      zipCode: "34722"
    },
    basketItems: [{
      id: "BI-1",
      price: "90",
      name: "Product 1",
      quantity: 1,
      category1: "Electronics",
      category2: "Smartphones",
      itemType: _iyzipay.default.BASKET_ITEM_TYPE.PHYSICAL
    }, {
      id: "BI-13",
      price: "150",
      name: "Product 1",
      quantity: 1,
      category1: "Electronics",
      category2: "Smartphones",
      itemType: _iyzipay.default.BASKET_ITEM_TYPE.PHYSICAL
    }, {
      id: "BI-12",
      price: "60",
      name: "Product 1",
      quantity: 1,
      category1: "Electronics",
      category2: "Smartphones",
      itemType: _iyzipay.default.BASKET_ITEM_TYPE.PHYSICAL
    }]
  }).then(result => {
    console.log(result);
    Logs.logFile("13-checkout-form-payments", result);
  }).catch(err => {
    console.log(err);
    Logs.logFile("13-checkout-form-payments-hata", err);
  });
};

/* initializeCheckoutFrom() */

//Tammalanmış veya tammalanmamış ödeme bilgisini gösterir
const getFromPayment = () => {
  Checkouts.getFormPaymet({
    locale: _iyzipay.default.LOCALE.TR,
    conversationId: (0, _nanoid.default)(),
    token: "026ae810-295c-4781-83b0-834769ae3224"
  }).then(result => {
    console.log(result);
    Logs.logFile("14-checkout-form-payments-get-details", result);
  }).catch(err => {
    console.log(err);
    Logs.logFile("14-checkout-form-payments-get-details-hata", err);
  });
};

/* getFromPayment() */

/* ------------------------------------- */
/*  F) CANCEL PAYMENTS            */
/* ------------------------------------- */

//ödemeyi iptal etme testi

const cancelPayments = () => {
  CancelPayments.cancelPayment({
    locale: _iyzipay.default.LOCALE.TR,
    conversationId: (0, _nanoid.default)(),
    paymentId: "23400469",
    ip: "192.168.1.1"
  }).then(result => {
    console.log(result);
    Logs.logFile("15-cancel-payments", result);
  }).catch(err => {
    console.log(err);
    Logs.logFile("15-cancel-payments-hata", err);
  });
};

/* cancelPayment() */

const cancelPaymentsWithReason = () => {
  CancelPayments.cancelPayment({
    locale: _iyzipay.default.LOCALE.TR,
    conversationId: (0, _nanoid.default)(),
    paymentId: "23400499",
    ip: "192.168.1.1",
    reason: _iyzipay.default.REFUND_REASON.BUYER_REQUEST,
    description: "Kullanıcı istegi ile iptal edildi"
  }).then(result => {
    console.log(result);
    Logs.logFile("16-cancel-payments-reason", result);
  }).catch(err => {
    console.log(err);
    Logs.logFile("16-cancel-payments-reason-hata", err);
  });
};
/* cancelPaymentsWithReason() */

/* ------------------------------------- */
/*  G) Refund Payments            */
/* ------------------------------------- */

//Ödemenin belirli bir tutarını iade etme testi

const refundPayment = () => {
  RefundPayments.refundPayments({
    locale: _iyzipay.default.LOCALE.TR,
    conversationId: (0, _nanoid.default)(),
    paymentTransactionId: "25405215",
    price: "30",
    currency: _iyzipay.default.CURRENCY.TRY,
    ip: "192.168.1.1"
  }).then(result => {
    console.log(result);
    Logs.logFile("17-refund-payments", result);
  }).catch(err => {
    console.log(err);
    Logs.logFile("17-refund-payments-hata", err);
  });
};

/* refundPayment() */

//Ödemenin bir kısmını neden ve açıklama ile iade et

const refundPaymentWithReason = () => {
  RefundPayments.refundPayments({
    locale: _iyzipay.default.LOCALE.TR,
    conversationId: (0, _nanoid.default)(),
    //Ürün ıd si ile iade edilebilir
    paymentTransactionId: "25405216",
    price: "30",
    currency: _iyzipay.default.CURRENCY.TRY,
    ip: "192.168.1.1",
    reason: _iyzipay.default.REFUND_REASON.BUYER_REQUEST,
    description: "Kullanıcı idae istedi"
  }).then(result => {
    console.log(result);
    Logs.logFile("18-refund-payments-with-reason", result);
  }).catch(err => {
    console.log(err);
    Logs.logFile("18-refund-payments-with-reason-hata", err);
  });
};

/* refundPaymentWithReason() */