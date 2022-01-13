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
      user: username,
      username: user_id
    }
    console.log("template:", templateVars)
    res.render("products", templateVars);
  })
  .catch((err) => {
    console.log(err.message);
  })
})

router.post("/sold/:id", (req, res) => {
  const productID = req.params.id;

  const queryString = `
    UPDATE products
    SET is_available = false
    WHERE id = $1;
  `

  db.query(queryString, [productID])
    .then(data => {
      res.redirect("/")
    })
    .catch(err => { console.log(err.message)
    });
});


module.exports = router
