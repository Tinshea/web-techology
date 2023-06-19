require("dotenv").config();
const { Connexion, closeConnexion } = require("../Database/connect");
const { Message } = require("../model/message");

function convertDateFormat(dateStr) {
    const [day, month, year, hour, minute] = dateStr.match(/\d+/g);
    return new Date(`${year}-${month}-${day}T${hour}:${minute}`);
}

const Addmessage = async (req, res) => {
    const client = await Connexion(process.env.DATABASE_URI);
    try {
        let message = new Message(
            req.body.userId,
            req.body.messageID,
            req.body.content,
            new Date().toLocaleTimeString([], {
                year: "numeric",
                month: "numeric",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            }),
            []
        );
        // Console log contenu serveur (vidéo)
        // console.log("Contenu du message côté serveur :", message);
        await client.db().collection("Message").insertOne(message);
    } catch (e) {
        res.status(500).json({ message: "Sorry, your message cannot be send" });
    } finally {
        closeConnexion(client);
        res.end();
    }
};

const RefreshListMessage = async (req, res) => {
    const { userId, sortBy = 'desc' } = req.query; // extraire les paramètres de la requête
  
    const client = await Connexion(process.env.DATABASE_URI);
    try {
      let messages;
      if (typeof userId !== "undefined") {
        // filtrer les messages par userId
        messages = await client
          .db()
          .collection("Message")
          .find({ userId: userId })
          .toArray();
      } else {
        messages = await client
          .db()
          .collection("Message")
          .find({})
          .toArray();
      }
  
      if (messages.length > 0) {
        const results = await Promise.all(messages.map(async (message) => {
          const { profilpicture, username } = await client
            .db()
            .collection("User")
            .findOne({ id: message.userId });
  
          // Supprimer le champ "Likes" et le remplacer par "LikesCount"
          const { Likes, ...rest } = message;
          const LikesCount = Likes.length;
  
          return { ...rest, profilpicture, username, LikesCount };
        }));
  
        // trier les résultats
        if (sortBy === 'asc') {
          results.sort((a, b) => convertDateFormat(a.time) - convertDateFormat(b.time));
        } else if (sortBy === 'desc') {
          results.sort((a, b) => convertDateFormat(b.time) - convertDateFormat(a.time));
        }
        res.status(200).json(results);
      } else {
        res.status(204).json();
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    } finally {
      closeConnexion(client);
      res.end();
    }
  };
  
  
const addlike = async (req, res) => {
    const client = await Connexion(process.env.DATABASE_URI);
    try {
        await client
            .db()
            .collection("Message")
            .findOneAndUpdate(
                { messageID: req.body.messageID },
                { $addToSet: { Likes: { UserID: req.body.UserID } } },
                { useFindAndModify: false }
            )
            .then(res.status(201).json({ message: "operation counted" }));
    } catch (e) {
        res.status(500).json(e);
    } finally {
        closeConnexion(client);
        res.end();
    }
};

const deletelike = async (req, res) => {
    const client = await Connexion(process.env.DATABASE_URI);
    try {
        await client
            .db()
            .collection("Message")
            .findOneAndUpdate(
                { messageID: req.body.messageID },
                { $pull: { Likes: { UserID: req.body.UserID } } },
                { useFindAndModify: false }
            )
            .then(res.status(201).json({ message: "operation counted" }));
    } catch (e) {
        res.status(500).json(e);
    } finally {
        closeConnexion(client);
        res.end();
    }
};

const isLiked = async (req, res) => {
    const client = await Connexion(process.env.DATABASE_URI);
    try {
        const results = await client.db().collection("Message").findOne({
            messageID: req.query.messageID,
            "Likes.UserID": req.query.UserID,
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

const DeleteMessage = async (req, res) => {
    const client = await Connexion(process.env.DATABASE_URI);
    try {
        await client
            .db()
            .collection("Message")
            .deleteOne({
                userId: req.body.User,
                messageID: req.body.messageID,
            });
    } catch (e) {
        console.error(e);
        res.status(500).json(e);
    } finally {
        closeConnexion(client);
        res.end();
    }
};

module.exports = {
    Addmessage,
    RefreshListMessage,
    DeleteMessage,
    addlike,
    deletelike,
    isLiked,
};
