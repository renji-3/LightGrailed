const express = require('express');
const router = express.Router();
const { Pool } = require("pg");
const dbParams = require("../lib/db.js");
const db = new Pool(dbParams);

router.get("/", (req, res) =>{
  const username = req.session.username;
  const user_id = req.session.userID;
  const templateVars = {
    user: user_id,
    username: username
  };
  res.render("filters", templateVars);
});

router.post("/", (req, res) =>{
  console.log(req.body);
  let price = req.body.prices;
  const username = req.session.username;
  const user_id = req.session.userID;

  return db
    .query(`SELECT * FROM products WHERE price <= $1 ORDER BY price DESC`, [price])
    .then((response) => {
      const templateVars = {
        products: response.rows,
        user: username
      };
      console.log("res", response.rows);
      console.log("template", templateVars);
      res.render("filters", templateVars);
    })
    .catch((err) => {
      console.log(err.message);
    });
});

module.exports = router;
