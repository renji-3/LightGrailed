// load .env data into process.env
require("dotenv").config();
// console.log(process.env.DB_USER)

// Web server config
const PORT = process.env.PORT || 8080;
// const sassMiddleware = require("./lib/sass-middleware");
const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cookieSession = require('cookie-session');
const morgan = require("morgan");

// PG database client/connection setup
const { Pool } = require("pg");
const dbParams = require("./lib/db.js");
const db = new Pool(dbParams);
db.connect();

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan("dev"));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
app.use(cookieSession({
  name: 'session',
  keys: ['key1']
}));

// app.use(
//   "/styles",
//   sassMiddleware({
//     source: __dirname + "/styles",
//     destination: __dirname + "/public/styles",
//     isSass: false, // false => scss, true => sass
//   })
// );

app.use(express.static("public"));

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const registerRoutes = require("./routes/register");
const loginRoutes = require("./routes/login");
const filterRoutes = require("./routes/filters");
const productRoutes = require("./routes/products");
const listingRoutes = require("./routes/createListing");
const favouritesRoutes = require("./routes/favourites");
const myListingRoutes = require("./routes/myListings");

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
app.use("/register", registerRoutes);
app.use("/login", loginRoutes);
app.use("/filters", filterRoutes);
app.use("/products", productRoutes);
app.use("/createlisting", listingRoutes(db));
app.use("/favourites", favouritesRoutes);
app.use("/myListings", myListingRoutes);
// Note: mount other resources here, using the same pattern above

// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).

app.get("/", (req, res) => {
  const user_id = req.session.userID;
  const username = req.session.username;

  db.query(`SELECT * FROM products ORDER BY id DESC`)
    .then((response) => {
      console.log("response:", response.rows);
      const templateVars = {
        product: response.rows,
        user: username,
        user_id: user_id
      };
      console.log("template:", templateVars);
      res.render("index", templateVars);
    })
    .catch((err) => {
      console.log(err.message);
    });

});

app.get("/messages", (req, res) => {
  console.log(req.session.userID);
  const username = req.session.username;
  const user_id = req.session.userID;
  const templateVars = {
    user: username
  };

  return db.query(`SELECT messages.*, products.*, users.* FROM messages JOIN products ON products.id = messages.product_id JOIN users ON users.id = messages.user_id WHERE users.id = $1 ORDER BY messages.id DESC`, [user_id])
    .then((response) => {
      console.log("response:", response.rows);
      const templateVars = {
        product: response.rows,
        user: username
      };
      console.log("template:", templateVars);
      res.render("messages", templateVars);
    })
    .catch((err) => {
      console.log(err.message);
    });
});

app.post("/messages", (req, res) => {
  console.log("body:", req.body);
  const message = req.body.message;
  const user_id = req.session.userID;
  const product_id = req.body.product_id;

  db.query(`INSERT INTO messages (user_id, product_id, message_content) VALUES ($1, $2, $3)`, [user_id, product_id, message])
    .then((response) => {
      console.log(response);
      res.send("success!~");
    })
    .catch((err) => {
      console.log(err.message);
    });
});

app.get("/success", (req, res) => {
  const username = req.session.username;
  const user_id = req.session.userID;
  const templateVars = {
    user: username,
    username: user_id,
  };
  res.render("listing-created", templateVars);
});

app.post('/logout', (req, res) => {
  req.session = null;
  res.redirect("/");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
