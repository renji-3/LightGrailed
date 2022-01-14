const express = require('express');
const router  = express.Router();

module.exports = (db) => {

  router.get("/", (req, res) => {
    const username = req.session.username;
    const user_id = req.session.userID;
    const templateVars = {
      user: username,
    };
    res.render("create-listing", templateVars);
  });

  router.post("/", (req, res) => {
    const user_id = req.session.userID;
    const username = req.session.username;

    const price = req.body.price;
    const productName = req.body.name;
    const productDescription = req.body.description;
    const imageUrl = req.body.image;

    const templateVars = {
      user: username
    };

    console.log(templateVars.user);

    const queryString = `
    INSERT INTO products (seller_id, product_name, price, product_description, image_url)
    VALUES ($1, $2, $3, $4, $5) RETURNING *;
  `;
    const queryParams = [user_id, productName, price, productDescription, imageUrl];

    db.query(queryString, queryParams)
      .then(response => {
        res.redirect("/success");
      })
      .catch(err => {
        console.log(err.message);
      });
  });
  return router;
};
