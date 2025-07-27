"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _mongoose = _interopRequireDefault(require("mongoose"));
var _bcrypt = _interopRequireDefault(require("bcrypt"));
var _nanoid = _interopRequireDefault(require("../utils/nanoid.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const {
  Schema
} = _mongoose.default;
const {
  ObjectId
} = Schema.Types;
const ramdomColorGenerator = () => {
  return Math.floor(Math.random() * 16777215).toString(16);
};
const UserSchema = new _mongoose.default.Schema({
  uid: {
    type: String,
    default: (0, _nanoid.default)(),
    required: true,
    unique: true
  },
  locale: {
    type: String,
    default: "tr",
    require: true,
    enum: ["tr", "en"]
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
  identityNumber: {
    type: String,
    required: true,
    unique: true,
    default: "00000000000"
  },
  password: {
    type: String,
    required: true
  },
  avatarUrl: {
    type: String
  },
  avatarColor: {
    type: String,
    default: ramdomColorGenerator(),
    require: true
  },
  address: {
    type: String,
    required: false
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true
  },
  city: {
    type: String,
    require: true
  },
  country: {
    type: String,
    require: true,
    default: "Turkey"
  },
  zipCode: {
    type: String,
    required: false
  },
  ip: {
    type: String,
    required: true,
    default: "85.34.78.112"
  },
  cardUserKey: {
    type: String,
    required: false
  },
  role: {
    type: String,
    default: "user",
    enum: ["user", "admin"]
  }
}, {
  _id: true,
  collection: "users",
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      delete ret.__v;
      delete ret.password;
      return {
        ...ret
      };
    }
  }
});
UserSchema.pre("save", async function (next) {
  try {
    this.password = await _bcrypt.default.hash(this.password, 10);
    return next();
  } catch (error) {
    return next(error);
  }
  next();
});
const User = _mongoose.default.model("User", UserSchema);
var _default = exports.default = User;