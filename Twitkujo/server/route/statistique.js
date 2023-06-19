const express = require("express");
const router = express.Router();
const { GetUserStat } = require("../controller/statistique");

router.route("/GetuserStat").get(GetUserStat);

module.exports = router;
