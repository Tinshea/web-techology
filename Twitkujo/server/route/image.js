const express = require("express");
const router = express.Router();
const { UploadImage } = require("../controller/image");

router.route("/uploadimage").post(UploadImage);
module.exports = router;
