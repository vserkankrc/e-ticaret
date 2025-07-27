// src/services/iyzico/connection/iyzipay.js
import Iyzipay from "iyzipay";
import config from "../config/config.js";

const iyzipay = new Iyzipay({
  apiKey: config.apiKey,
  secretKey: config.secretKey,
  uri: config.uri,
});

export default iyzipay;
