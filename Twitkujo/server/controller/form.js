require("dotenv").config();
const { Connexion, closeConnexion } = require("../Database/connect");
const { User } = require("../model/user");
const bcrypt = require("bcrypt");

const Register = async (req, res) => {
  let id = new Date().getTime().toString();
  let username = req.body.username;
  let password = req.body.password;
  if (username && password && id) {
    const client = await Connexion(process.env.DATABASE_URI);
    try {
      const hashpassword = await bcrypt.hash(password, 10);
      let user = new User(
        id,
        username,
        hashpassword,
        "",
        "https://res.cloudinary.com/dhmplkcxd/image/upload/v1681855436/banner/Default_Banner_lxp1ss.jpg",
        "default",
        0
      );
      const results = await client
        .db()
        .collection("User")
        .findOne({ username: username });
      if (results !== null) {
        res.status(409).json({ message: "User already exists" });
      } else {
        await client.db().collection("User").insertOne(user);
        delete user.password;
        const response = Object.assign(
          {},
          { User: user },
          { message: "User registered successfully!" }
        );
        req.session.User = user;
        res.status(201).json(response);
      }
    } catch (e) {
      console.error(e);
      res.status(500).json({
        message: "An error occurred while trying to register.",
      });
    } finally {
      closeConnexion(client);
      res.end();
    }
  } else {
    res.status(406).json({ message: "Please enter all fields" });
  }
};

const Login = async (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    if (username && password) {
      const client = await Connexion(process.env.DATABASE_URI);
      try {
        const results = await client
          .db()
          .collection("User")
          .findOne({ username: username });
        if (results !== null) {
          let isEqual = await bcrypt.compare(password, results.password);
          if (isEqual) {
            delete results.password;
            const response = Object.assign(
              {},
              { User: results },
              { message: "Access Granted" }
            );
            req.session.User = results;
            res.status(200).json(response);
          } else {
            res.status(400).json({ message: "Try another username or password" });
          }
        } else {
          res.status(400).json({ message: "User not found" });
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

  const Isconnected = async (req, res) => {
    if (req.session.User) {
      res.status(200).json(req.session.User.id);
    } else {
      res.status(401).json({});
    }
  };
  
  const Logout = async (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: "An error occurred while logging out." });
      } else {
        res.json({ message: "You have been successfully logged out." });
      }
    });
  };

  module.exports = {
    Register,
    Login,
    Isconnected,
    Logout,
  };
  