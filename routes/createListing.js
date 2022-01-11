const express = require('express');
const router  = express.Router();

module.exports = (db) => {

  router.get("/", (req, res) => {
    res.render("create-listing");
  });
  router.post("/", (req, res) => {
    const userID = req.session.userID;
    const price = (req.body.price * 100);
    const productName = req.body.name;
    const productDescription = req.body.description;
    const imageUrl = req.body.image_url;

    const queryString = `
    INSERT INTO products (seller_id, product_name, price, product_description, image_url)
    VALUES ($1, $2, $3, $4, $5) RETURNING *;
  `;
    const queryParams = [userID, productName, price, productDescription, imageUrl];

    db.query(queryString, queryParams)
      .then(response => {
        res.redirect("/");
      })
      .catch(err => {
        console.log(err.message);
      });
  });
  return router;
};

