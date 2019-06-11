"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _authentication = _interopRequireDefault(require("../middleware/authentication"));

var _adminAuthorization = _interopRequireDefault(require("../middleware/admin-authorization"));

var _login = _interopRequireDefault(require("../middleware/login"));

var _user = _interopRequireDefault(require("../controller/user"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var router = _express["default"].Router(); //end point to create a new user


router.post('/', _user["default"].post); //endpoint to get all document authored by a user

router.get('/:id/documents', _login["default"], _user["default"].getUserDocs); //endpoint to  view all users, only admin can view all users

router.get('/', [_authentication["default"], _adminAuthorization["default"]], _user["default"].get); //endpoint for logged in user to view his details

router.get('/me', [_authentication["default"]], _user["default"].getMe); //endpoint to update details, only a logged in user can update his own account

router.put('/', _authentication["default"], _user["default"].put); //endpoint to delete a user, only a logged in user can delete his own record

router["delete"]('/', _authentication["default"], _user["default"]["delete"]);
var _default = router;
exports["default"] = _default;