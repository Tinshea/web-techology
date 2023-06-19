require("dotenv").config();
const { Connexion, closeConnexion } = require("../Database/connect");

function convertDateFormat(dateStr) {
    const [day, month, year, hour, minute] = dateStr.match(/\d+/g);
    return new Date(`${year}-${month}-${day}T${hour}:${minute}`);
}

const FilterMessage = async (req, res) => {
    const { filter, sortBy = "desc" } = req.query; // extraire les paramètres de la requête
    const client = await Connexion(process.env.DATABASE_URI);
    try {
        const messages = await client
            .db()
            .collection("Message")
            .find({})
            .toArray();
        if (messages.length > 0) {
            const filteredMessages = messages.filter((message) =>
                message.content.toUpperCase().includes(filter.toUpperCase())
            );
            if (filteredMessages.length > 0) {
                const processedMessages = await Promise.all(
                    filteredMessages.map(async (message) => {
                        const { profilpicture, username } = await client
                            .db()
                            .collection("User")
                            .findOne({ id: message.userId });
                        const { Likes, ...rest } = message;
                        const LikesCount = Likes.length;
                        return { ...rest, profilpicture, username, LikesCount };
                    })
                );
                // trier les résultats
                if (sortBy === "asc") {
                    processedMessages.sort(
                        (a, b) =>
                            convertDateFormat(a.time) -
                            convertDateFormat(b.time)
                    );
                } else if (sortBy === "desc") {
                    processedMessages.sort(
                        (a, b) =>
                            convertDateFormat(b.time) -
                            convertDateFormat(a.time)
                    );
                }
                res.status(200).json(processedMessages);
            } else {
                res.status(204).json([]);
            }
        } else {
            res.status(204).json([]);
        }
    } catch (e) {
        res.status(500).json(e);
    } finally {
        await closeConnexion(client);
    }
};

const FilterByUserId = async (req, res) => {
    const { filterUserId, sortBy = "desc" } = req.query; // extraire les paramètres de la requête

    const client = await Connexion(process.env.DATABASE_URI);
    try {
        let messages = await client
            .db()
            .collection("Message")
            .find({})
            .toArray();
        if (messages.length > 0) {
            messages = messages.filter((message) =>
                filterUserId.includes(message.userId)
            );
            if (messages.length > 0) {
                const results = await Promise.all(
                    messages.map(async (message) => {
                        const { profilpicture, username } =
                            await client
                                .db()
                                .collection("User")
                                .findOne({ id: message.userId });
                        const { Likes, ...rest } = message;
                        const LikesCount = Likes.length;
                        return { ...rest, profilpicture, username, LikesCount };
                    })
                );
                // trier les résultats
                if (sortBy === "asc") {
                    results.sort(
                        (a, b) =>
                            convertDateFormat(a.time) -
                            convertDateFormat(b.time)
                    );
                } else if (sortBy === "desc") {
                    results.sort(
                        (a, b) =>
                            convertDateFormat(b.time) -
                            convertDateFormat(a.time)
                    );
                }

                res.json(results);
            } else {
                res.status(204).json([]);
            }
        } else {
            res.status(204).json([]);
        }
    } catch (e) {
        res.status(500).json(e);
    } finally {
        await closeConnexion(client);
    }
};

const myLikes = async (req, res) => {
    const client = await Connexion(process.env.DATABASE_URI);
    try {
        const messages = await client
            .db()
            .collection("Message")
            .find({
                "Likes.UserID": req.query.UserID,
            })
            .toArray();
        if (messages.length > 0) {
            const results = await Promise.all(
                messages.map(async (message) => {
                    const { profilpicture, username } = await client
                        .db()
                        .collection("User")
                        .findOne({ id: message.userId });
                    const { Likes, ...rest } = message;
                    const LikesCount = Likes.length;
                    return { ...rest, profilpicture, username, LikesCount };
                })
            );
            results.sort(
                (a, b) => convertDateFormat(b.time) - convertDateFormat(a.time)
            );
            res.status(200).json(results);
        } else {
            res.status(204).json([]);
        }
    } catch (e) {
        console.error(e);
        res.status(500).json(e);
    } finally {
        closeConnexion(client);
        res.end();
    }
};

const mostLikes = async (req, res) => {
    const client = await Connexion(process.env.DATABASE_URI);
    try {
        const messages = await client
            .db()
            .collection("Message")
            .aggregate([
                {
                    $project: {
                        userId: 1,
                        messageID: 1,
                        content: 1,
                        time: 1,
                        LikesCount: { $size: "$Likes" },
                    },
                },
                { $sort: { LikesCount: -1 } },
            ])
            .toArray();
        if (messages.length > 0) {
            const results = await Promise.all(
                messages.map(async (message) => {
                    const { profilpicture, username } = await client
                        .db()
                        .collection("User")
                        .findOne({ id: message.userId });
                    return { ...message, profilpicture, username };
                })
            );
            res.status(200).json(results);
        } else {
            res.status(204).json([]);
        }
    } catch (e) {
        console.error(e);
        res.status(500).json(e);
    } finally {
        closeConnexion(client);
        res.end();
    }
};

module.exports = { FilterMessage, FilterByUserId, myLikes, mostLikes };
