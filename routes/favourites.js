const express = require('express');
const router = express.Router();
const { Pool } = require("pg");
const dbParams = require("../lib/db.js");
const db = new Pool(dbParams);


router.get("/", (req, res) => {
  const id = req.session.userID;
  console.log(id);
  const username = req.session.username;
  const user_id = req.session.userID;

  const queryString = `
    SELECT products.*, favourites.* FROM products
    JOIN favourites ON product_id = products.id
    WHERE favourites.user_id = $1
    ORDER BY favourites.id DESC;
  `;
  db.query(queryString, [id])
    .then(response => {
      console.log("res:", response.rows);
      const templateVars = {
        product: response.rows,
        user: username
      };
      console.log("template:", templateVars);
      res.render("favourites", templateVars);
    })
    .catch((err) => {
      console.log(err.message);
    });
});

router.post("/", (req, res) => {
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

router.delete("/delete", (req, res) => {
  const user_id = req.session.userID
  const product_id = req.body.product_id;
  console.log(req.body);

  db.query(`
  DELETE FROM favourites WHERE user_id = $1 AND product_id = $2 RETURNING *`, [user_id, product_id])
    .then((response) => {
      console.log(response);
      res.send("success!~");
    })
    .catch((err) => {
      console.log(err.message);
      res.send("failure");
    });

});


module.exports = router;
