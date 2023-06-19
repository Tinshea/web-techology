require("dotenv").config();
const { Connexion, closeConnexion } = require("../Database/connect");
const { UserStat } = require("../model/statistique");

const GetUserStat = async (req, res) => {
    const client = await Connexion(process.env.DATABASE_URI);
    try {
        const results = await client
            .db()
            .collection("Message")
            .aggregate([
                { $match: { userId: req.query.userID } },
                {
                    $project: {
                        userId: 1,
                        messageID: 1,
                        content: 1,
                        time: 1,
                        likesCount: { $size: "$Likes" },
                    },
                },
                { $sort: { likesCount: -1 } },
            ])
            .toArray();
        let average = 0;
        var nbmessage = 0;
        var maxlike = 0;
        if (results.length > 0) {
            nbmessage = results.length;
            for (let i = 0; i < nbmessage; i++) {
                average += results[i].likesCount;
            }
            average = average / nbmessage;

            maxlike = results[0].likesCount;
        }
        let rank;
        switch (true) {
            case average >= 1000:
                rank = "SSS";
                break;
            case average >= 500:
                rank = "SS";
                break;
            case average >= 250:
                rank = "S";
                break;
            case average >= 100:
                rank = "A";
                break;
            case average >= 50:
                rank = "B";
                break;
            case average >= 25:
                rank = "C";
                break;
            default:
                rank = "D";
        }

        res.status(200).json(new UserStat(nbmessage, average, maxlike, rank));
    } catch (e) {
        console.error(e);
        res.status(500).json(e);
    } finally {
        closeConnexion(client);
        res.end();
    }
};

module.exports = { GetUserStat };
