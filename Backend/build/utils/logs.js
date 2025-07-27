"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _fs = _interopRequireDefault(require("fs"));
var _path = _interopRequireDefault(require("path"));
var _url = require("url");
var _winston = _interopRequireDefault(require("winston"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const _filename = (0, _url.fileURLToPath)(import.meta.url);
const _dirname = _path.default.dirname(_filename);
const logDir = _path.default.join(_dirname, "..", "logs");
if (!_fs.default.existsSync(logDir)) {
  _fs.default.mkdirSync(logDir, {
    recursive: true
  });
}
const logger = _winston.default.createLogger({
  level: "info",
  format: _winston.default.format.json(),
  transports: [new _winston.default.transports.File({
    filename: _path.default.join(logDir, "error.log"),
    level: "error"
  }), new _winston.default.transports.File({
    filename: _path.default.join(logDir, "combined.log")
  }), new _winston.default.transports.Console({
    format: _winston.default.format.simple()
  }) // ✅ bunu ekledik
  ]
});
var _default = exports.default = logger;