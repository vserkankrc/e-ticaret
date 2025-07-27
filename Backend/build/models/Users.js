"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _mongoose = _interopRequireDefault(require("mongoose"));
var _nanoid = _interopRequireDefault(require("../utils/nanoid.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const {
  Schema
} = _mongoose.default;

// Adres şeması: artık alanlar required değil.
// Böylece kullanıcı henüz adres eklememişse hata oluşmaz.
const addressSchema = new Schema({
  label: {
    type: String,
    default: ""
  },
  // Örn: "Ev", "Ofis"
  address: {
    type: String,
    default: ""
  },
  province: {
    type: String,
    default: ""
  },
  district: {
    type: String,
    default: ""
  },
  postalCode: {
    type: String,
    default: ""
  },
  country: {
    type: String,
    default: "Türkiye"
  }
}, {
  _id: false
});
const UsersSchema = new Schema({
  uid: {
    type: String,
    default: () => (0, _nanoid.default)(),
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  surname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  // Şifre yalnızca OAuth olmayan kullanıcılar için zorunlu
  password: {
    type: String,
    required: function () {
      return !this.isOAuthUser;
    }
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true
  },
  gender: {
    type: String,
    enum: ["Erkek", "Kadın", "Diğer"],
    default: "diğer"
  },
  tcIdentityNumber: {
    type: String,
    default: null,
    validate: {
      validator: function (v) {
        return !v || /^\d{11}$/.test(v);
      },
      message: "T.C. Kimlik numarası 11 haneli olmalıdır."
    }
  },
  billingType: {
    type: String,
    enum: ["bireysel", "kurumsal"],
    default: "bireysel"
  },
  // Kurumsal kullanıcılar için isteğe bağlı alanlar
  companyName: {
    type: String,
    default: null
  },
  taxNumber: {
    type: String,
    default: null
  },
  taxOffice: {
    type: String,
    default: null
  },
  // Adres alanları: yalnızca kullanıcı eklerse eklenir, sistem müdahale etmez
  personalAddress: {
    type: addressSchema,
    default: null
  },
  billingAddress: {
    type: addressSchema,
    default: null
  },
  shippingAddress: {
    type: addressSchema,
    default: null
  },
  ip: {
    type: String,
    required: true,
    default: "85.34.78.112" // gerçek IP yerine dummy değer
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  },
  resetToken: {
    type: String,
    default: null
  },
  resetTokenExpiration: {
    type: Date,
    default: null
  },
  // Google OAuth alanları
  googleId: {
    type: String,
    unique: true,
    sparse: true,
    default: null
  },
  avatar: {
    type: String,
    default: null
  },
  isOAuthUser: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});
const Users = _mongoose.default.model("Users", UsersSchema);
var _default = exports.default = Users;