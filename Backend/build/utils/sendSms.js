"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sendSms = void 0;
var _twilio = _interopRequireDefault(require("twilio"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = (0, _twilio.default)(accountSid, authToken);
const sendSms = async ({
  to,
  message
}) => {
  try {
    const sms = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to
    });
    console.log("📩 SMS gönderildi:", sms.sid);
  } catch (error) {
    console.error("❌ SMS gönderilemedi:", error.message);
  }
};
exports.sendSms = sendSms;