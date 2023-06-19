require("dotenv").config();
const { Connexion,closeConnexion } = require("../Database/connect");

const AddFriends = async (req, res) => {
  // console.log("AddFriends req.body ", req.body)
  if (req.body.userID === req.body.friendID) {
    return res
      .status(400)
      .json({ message: "User ID and friend ID cannot be the same" });
  } else {
    const client = await Connexion(process.env.DATABASE_URI);
    try {
      await client
        .db()
        .collection("FriendsList")
        .findOneAndUpdate(
          { UserId: req.body.userID },
          { $addToSet: { FriendsList: { friendID: req.body.friendID } } },
          { useFindAndModify: false, upsert: true }
        )
        .then(async () => {
          await client
            .db()
            .collection("User")
            .findOneAndUpdate(
              { id: req.body.friendID },
              { $inc: { nbfollowers: 1 } },
              { useFindAndModify: false }
            );
          res.status(201).json({ message: "Operation counted" });
        });
    } catch (e) {
      console.error(e);
      res.status(500).json(e);
    } finally {
      closeConnexion(client);
      res.end();
    }
  }
};

const GetFriends = async (req, res) => {
  const client = await Connexion(process.env.DATABASE_URI);
  try {
    // console.log("GetFriends req.query ",req.query)
    const results = await client
      .db()
      .collection("FriendsList")
      .findOne({ UserId: req.query.UserId });
    // console.log("GetFriends results", results)
    if (results !== null) {
      res.status(200).json(results.FriendsList);
    } else {
      res.status(204).json();
    }
  } catch (e) {
    console.error(e);
    res.status(500).json(e);
  } finally {
    closeConnexion(client);
    res.end();
  }
};

const isFriend = async (req, res) => {
  const client = await Connexion(process.env.DATABASE_URI);
  try {
    const results = await client.db().collection("FriendsList").findOne({
      UserId: req.query.UserId,
      "FriendsList.friendID": req.query.ProfileId,
    });
    res.status(200).json({ verif: results !== null });
  } catch (e) {
    console.error(e);
    res.status(500).json(e);
  } finally {
    closeConnexion(client);
    res.end();
  }
};

const DeleteFriend = async (req, res) => {
  const client = await Connexion(process.env.DATABASE_URI);
  try {
    await client
      .db()
      .collection("FriendsList")
      .findOneAndUpdate(
        { UserId: req.body.UserID },
        { $pull: { FriendsList: { friendID: req.body.friendID } } },
        { useFindAndModify: false }
      )
      .then(async () => {
        await client
          .db()
          .collection("User")
          .findOneAndUpdate(
            { id: req.body.friendID },
            { $inc: { nbfollowers: -1 } },
            { useFindAndModify: false }
          );
        res.status(201).json({ message: "Operation counted" });
      });
  } catch (e) {
    res.status(500).json(e);
  } finally {
    closeConnexion(client);
    res.end();
  }
};
module.exports = { AddFriends, DeleteFriend, GetFriends, isFriend };
