const express = require("express");
const router = express.Router();
const { Register, Login, Isconnected, Logout } = require("../controller/form");

router.route("/register").post(Register);
router.route("/login").post(Login);
router.route("/Isconnected").get(Isconnected);
router.route("/Logout").delete(Logout);
module.exports = router;
