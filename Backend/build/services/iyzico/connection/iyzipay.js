"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _iyzipay = _interopRequireDefault(require("iyzipay"));
var _config = _interopRequireDefault(require("../config/config.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
// src/services/iyzico/connection/iyzipay.js

const iyzipay = new _iyzipay.default({
  apiKey: _config.default.apiKey,
  secretKey: _config.default.secretKey,
  uri: _config.default.uri
});
var _default = exports.default = iyzipay;