require("dotenv").config();
const { Connexion, closeConnexion } = require("../Database/connect");

const getuser = async (req, res) => {
  const client = await Connexion(process.env.DATABASE_URI);
  try {
    const results = await client
      .db()
      .collection("User")
      .findOne({ id: req.query.UserId });
    if (results !== null) {
      delete results.password;
      res.status(200).json(results);
    } else {
      res.status(400).json({ message: "User_id not found" });
    }
  } catch (e) {
    console.error(e);
    res
      .status(500)
      .json({ message: "An error occurred while trying to connect." });
  } finally {
    closeConnexion(client);
    res.end();
  }
};

const changeusername = async (req, res) => {
  let username = req.body.username;
  let newUsername = req.body.newUsername;
  if (username && newUsername) {
    const client = await Connexion(process.env.DATABASE_URI);
    try {
      const results = await client
        .db()
        .collection("User")
        .findOne({ username: newUsername });
      if (results !== null) {
        res.status(409).json({ message: "Username already taken" });
      } else {
        await client
          .db()
          .collection("User")
          .findOneAndUpdate(
            { username: username },
            { $set: { username: newUsername } },
            { useFindAndModify: false }
          )
          .then(
            res.status(201).json({ message: "Your username has been changed" })
          );
      }
    } catch (e) {
      console.error(e);
      res
        .status(500)
        .json({ message: "An error occurred while trying to connect." });
    } finally {
      closeConnexion(client);
      res.end();
    }
  } else {
    res.status(406).json({ message: "Please enter all fields" });
  }
};

const changetheme = async (req, res) => {
  let id = req.body.id;
  let theme = req.body.theme;
  if (id && theme) {
    const client = await Connexion(process.env.DATABASE_URI);
    try {
      await client
        .db()
        .collection("User")
        .findOneAndUpdate(
          { id: id },
          { $set: { theme: theme } },
          { useFindAndModify: false }
        )
        .then(res.status(201).json({ message: "Your theme has been changed" }));
    } catch (e) {
      console.error(e);
      res
        .status(500)
        .json({ message: "An error occurred while trying to connect." });
    } finally {
      closeConnexion(client);
      res.end();
    }
  } else {
    res.status(406).json({ message: "Please enter all fields" });
  }
};



module.exports = {
  getuser,
  changeusername,
  changetheme,
};
