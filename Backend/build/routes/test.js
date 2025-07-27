"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = _interopRequireDefault(require("express"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const router = _express.default.Router();
router.get('/', async (req, res) => {
  try {
    // Get the client's IP address
    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress || req.ip;
    const userAgent = req.headers['user-agent'];

    // Send the response
    res.json({
      ip: ip,
      userAgent: userAgent
    });
  } catch (error) {
    // Handle any errors
    console.error('Error retrieving client info:', error);
    res.status(500).json({
      message: 'Internal server error'
    });
  }
});
var _default = exports.default = router;