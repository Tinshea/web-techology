const express = require("express");
const router = express.Router();
const {
  Addmessage,
  RefreshListMessage,
  DeleteMessage,
  addlike,
  deletelike,
  isLiked,
} = require("../controller/message");

router.route("/addMessage").post(Addmessage);
router.route("/refreshlistMessage").get(RefreshListMessage);
router.route("/deletemessage").delete(DeleteMessage);
router.route("/addlike").put(addlike);
router.route("/deletelike").delete(deletelike);
router.route("/isLiked?").get(isLiked);

module.exports = router;
