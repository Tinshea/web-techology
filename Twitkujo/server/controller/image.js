require("dotenv").config();
const { Connexion, closeConnexion } = require("../Database/connect");
const cloudinary = require("cloudinary").v2;

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const UploadImage = async (req, res) => {
  const client = await Connexion(process.env.DATABASE_URI);
  try {
    const respond = await cloudinary.uploader.upload(req.body.image, {
      public_id: req.body.public_id,
      folder: req.body.type,
    });
    await client
      .db()
      .collection("User")
      .findOneAndUpdate(
        { id: req.body.public_id },
        { $set: { [req.body.type]: respond.secure_url } },
        { useFindAndModify: false }
      );
    res.status(201).json({ message: "Image uploaded" });
  } catch (e) {
    res.status(500).json({ error: "Failed to upload image" });
  } finally {
    closeConnexion(client);
    res.end();
  }
};

module.exports = { UploadImage };
