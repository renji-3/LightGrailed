// load .env data into process.env
require("dotenv").config()
// console.log(process.env.DB_USER)

// Web server config
const PORT = process.env.PORT || 8080;
// const sassMiddleware = require("./lib/sass-middleware");
const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
// const cookieSession = require('cookie-session');
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
// app.use(cookieSession({
//   name: 'session',
//   keys: ['key1']
// }));

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
const loginRoutes = require("./routes/login")

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
app.use("/api/users", usersRoutes(db));
app.use("/api/widgets", widgetsRoutes(db));
app.use("/register", registerRoutes)
app.use("/login", loginRoutes)
// Note: mount other resources here, using the same pattern above

// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/products/:id", (req, res) => {
  const id = req.params.id;

  db.query(`SELECT id, seller_id, product_name, is_available, price, product_description, list_date, image_url FROM products WHERE id = $1`, [id])
  .then((response) => {
    console.log(response.rows[0])
    const templateVars = {
      product: response.rows[0]
    }
    console.log("template:", templateVars)
    res.render("products", templateVars);
  })
  .catch((err) => {
    console.log(err.message);
  })
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
