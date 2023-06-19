const express = require("express");
const { FilterMessage, FilterByUserId, myLikes, mostLikes } = require("../controller/filter");
const router = express.Router();

router.route("/fitremessage").get(FilterMessage);
router.route("/FilterByUserId").get(FilterByUserId);
router.route("/myLikes").get(myLikes);
router.route("/mostLikes").get(mostLikes);

module.exports = router;
