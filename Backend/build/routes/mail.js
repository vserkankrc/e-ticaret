"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = _interopRequireDefault(require("express"));
var _sendEmail = _interopRequireDefault(require("../services/Email/sendEmail.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const router = _express.default.Router();
router.post("/send-confirmation", async (req, res) => {
  const {
    to,
    subject,
    text,
    html
  } = req.body;
  try {
    await (0, _sendEmail.default)({
      to,
      subject,
      text,
      html
    });
    res.status(200).json({
      success: true,
      message: "Mail gönderildi"
    });
  } catch (error) {
    console.error("Mail gönderilemedi:", error);
    res.status(500).json({
      success: false,
      message: "Mail gönderilemedi"
    });
  }
});
var _default = exports.default = router;