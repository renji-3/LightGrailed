const express = require('express');
const router = express.Router();
const { Pool } = require("pg");
const dbParams = require("../lib/db.js");
const db = new Pool(dbParams);

router.get("/", (req, res) => {
  const userID = req.session.userID;
  const username = req.session.username;
  const user_id = req.session.userID

  const queryString = `
    SELECT * FROM products
    WHERE products.seller_id = $1
  `

  return db.query(queryString, [userID])
    .then((response) => {
    // console.log(response.rows[0])
      const templateVars = {
        product: response.rows,
        user: user_id,
        username: username
      }
      console.log(templateVars.myListings);
      res.render("my-listings", templateVars);
    })
    .catch((err) => {
      console.log(err.message);
    })
})

router.delete("/delete", (req, res) => {
  const product_id = req.body.product_id;
  console.log(req.body)

  db.query(`
  DELETE FROM products WHERE products.id = $1 RETURNING *`, [product_id])
  .then((response) => {
    console.log(response)
    res.send("success!~")
  })
  .catch((err) => {
    console.log(err.message);
    res.send("failure")
  });

})

module.exports = router;
