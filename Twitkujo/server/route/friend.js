const express = require("express");
const {
  AddFriends,
  DeleteFriend,
  GetFriends,
  isFriend,
} = require("../controller/friends");
const router = express.Router();

router.route("/addFriends").post(AddFriends);
router.route("/deletefriend").delete(DeleteFriend);
router.route("/refreshlistfriends").get(GetFriends);
router.route("/isfriend").get(isFriend);

module.exports = router;
