const express = require('express');
const router = express.Router();
const { Pool } = require("pg");
const dbParams = require("../lib/db.js");
const db = new Pool(dbParams);

router.get("/", (req, res) =>{
  res.render("filters")
})

router.post("/", (req, res) =>{
  console.log(req.body)
  const price = req.body.prices;

  return db
  .query(`SELECT * FROM products WHERE products.price <= $1`, [price])
  .then((response) => {
    const templateVars = {
      products: response.rows
    }
    console.log("res", response.rows)
    console.log("template", templateVars)
    res.render("filters", templateVars)
  })
  .catch((err) => {
    console.log(err.message);
  });
})

module.exports = router
