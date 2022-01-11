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
  keys: ['midterm']
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
const usersRoutes = require("./routes/users");
const widgetsRoutes = require("./routes/widgets");
const registerRoutes = require("./routes/register");
const loginRoutes = require("./routes/login");
const filterRoutes = require("./routes/filters");
const productRoutes = require("./routes/products");
const listingRoutes = require("./routes/createListing");

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
app.use("/api/users", usersRoutes(db));
app.use("/api/widgets", widgetsRoutes(db));
app.use("/register", registerRoutes);
app.use("/login", loginRoutes);
app.use("/filters", filterRoutes);
app.use("/products", productRoutes);
app.use("/createlisting", listingRoutes(db));
// Note: mount other resources here, using the same pattern above


// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).

app.get("/", (req, res) => {
  return db.query(`SELECT * FROM products ORDER BY id`)
    .then((response) => {
      console.log("response:", response.rows);
      const templateVars = {
        product: response.rows
      };
      console.log("template:", templateVars);
      res.render("index", templateVars);
    })
    .catch((err) => {
      console.log(err.message);
    });
});

app.get("/favourites", (req, res) => {
  const id = req.session.userID;
  console.log(id);
  console.log("123");

  const queryString =
    `SELECT products.*, favourites.* FROM products
    JOIN favourites ON product_id = products.id
    WHERE favourites.user_id = $1`;

  db.query(queryString, [id])
    .then(response => {
      console.log("res:", response.rows);
      const templateVars = {
        product: response.rows
      };
      console.log("template:", templateVars);
      res.render("favourites", templateVars);
    })
    .catch((err) => {
      console.log(err.message);
    });
});
app.get("/messages", (req, res) => {

  db.query(`SELECT * FROM messages JOIN messagethreads ON messagethreads.id = message_thread_id JOIN products ON products.id = product_id JOIN users ON users.id = seller_id WHERE product_id = $1`, [4])
    .then((response) => {
      console.log("response:", response.rows[0]);
      const templateVars = {
        product: response.rows[0]
      };
      console.log("template:", templateVars);
      res.render("messages", templateVars);
    })
    .catch((err) => {
      console.log(err.message);
    });
});

app.post("/favourites", (req, res) => {
  const product_id = req.body.product_id;
  console.log(product_id);
  const user_id = req.session.userID;

  db.query(`
    INSERT INTO favourites (user_id, product_id) VALUES ($1, $2)
  `, [user_id, product_id])
    .then((response) => {
      console.log(response);
      res.send("success!~");
    })
    .catch((err) => {
      console.log(err.message);
      res.send("failure");
    });

});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

