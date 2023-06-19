require("dotenv").config();
const express = require("express");
const session = require("express-session");
const path = require("path");
const formRouter = require("./route/form");
const userRouter = require("./route/user");
const MessRouter = require("./route/message");
const FriendsRouter = require("./route/friend");
const FilterRouter = require("./route/filter");
const StatRouter = require("./route/statistique");
const MongoStore = require("connect-mongo");
const ImageRouter = require("./route/image");

const app = express();

app.use(
  session({
    name: process.env.SESSION_NAME,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 7200000,
      secure: false,
    },
    store: MongoStore.create({ mongoUrl: process.env.DATABASE_URI }),
  })
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.use(express.static(path.join(__dirname, "../client/build")));

app.use("/api/Form", formRouter);
app.use("/api/user", userRouter);
app.use("/api/Message", MessRouter);
app.use("/api/Friends", FriendsRouter);
app.use("/api/image", ImageRouter);
app.use("/api/filter", FilterRouter);
app.use("/api/stats", StatRouter);

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

app.listen(
  process.env.PORT,
  console.log(`Server started on port ${process.env.PORT}`)
);
