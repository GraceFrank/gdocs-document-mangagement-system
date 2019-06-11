"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _authentication = _interopRequireDefault(require("../middleware/authentication"));

var _login = _interopRequireDefault(require("../middleware/login"));

var _validateId = _interopRequireDefault(require("../middleware/validate-id"));

var _documents = _interopRequireDefault(require("../controller/documents"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var router = _express["default"].Router();

router.post('/', _authentication["default"], _documents["default"].post);
router.put('/:id', [_validateId["default"], _authentication["default"]], _documents["default"].put);
router.get('/', _login["default"], _documents["default"].get);
router["delete"]('/:id', [_validateId["default"], _authentication["default"]], _documents["default"]["delete"]);
router.get('/:id', [_validateId["default"], _login["default"]], _documents["default"].getById);
var _default = router;
exports["default"] = _default;