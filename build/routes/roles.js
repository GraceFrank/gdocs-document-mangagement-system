"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _authentication = _interopRequireDefault(require("../middleware/authentication"));

var _adminAuthorization = _interopRequireDefault(require("../middleware/admin-authorization"));

var _validateId = _interopRequireDefault(require("../middleware/validate-id"));

var _role = _interopRequireDefault(require("../controller/role"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var router = _express["default"].Router(); //endpoint to create a new role


router.post('/', [_authentication["default"], _adminAuthorization["default"]], _role["default"].post); //endpoint to get all roles

router.get('/', _role["default"].get); //endpoint to get a role by its id

router.get('/:id', _validateId["default"], _role["default"].getById); //endpoint to update an existing role

router.put('/:id', [_validateId["default"], _authentication["default"], _adminAuthorization["default"]], _role["default"].put);
var _default = router;
exports["default"] = _default;