const express = require('express');
const router = express.Router();
const { Pool } = require("pg");
const dbParams = require("../lib/db.js");
const db = new Pool(dbParams);

router.get("/:id", (req, res) => {
  const id = req.params.id;
  const username = req.session.username;
  const user_id = req.session.userID

  db.query(`SELECT * FROM products WHERE products.id = $1`, [id])
  .then((response) => {
    // console.log(response.rows[0])
    const templateVars = {
      product: response.rows[0],
      user: user_id,
      username: username
    }
    console.log("template:", templateVars)
    res.render("products", templateVars);
  })
  .catch((err) => {
    console.log(err.message);
  })
})

module.exports = router
