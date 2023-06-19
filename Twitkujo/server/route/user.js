const express = require("express");
const router = express.Router();
const { getuser, changeusername, changetheme } = require("../controller/user");

router.route("/changeusername").put(changeusername);
router.route("/getuser").get(getuser);
router.route("/changetheme").put(changetheme);
module.exports = router;
