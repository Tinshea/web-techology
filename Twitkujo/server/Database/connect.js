const { MongoClient, Db } = require("mongodb");

async function Connexion(url) {
  const client = new MongoClient(url);
  try {
    await client.connect();
    return client;
  } catch (e) {
    console.log("Connexion doesn't succeed: ", e.message);
  }
}

function db() {
  return new Db(client, "Twitkujo");
}

async function closeConnexion(client) {
  if (client) {
    try {
      await client.close();
    } catch (e) {
      console.log("Failed to close connection: ", e.message);
    }
  }
}

module.exports = { Connexion, db, closeConnexion };
