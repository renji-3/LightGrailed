const express = require('express');
const router = express.Router();
const { Pool } = require("pg");
const dbParams = require("../lib/db.js");
const db = new Pool(dbParams);

router.get("/", (req, res) => {
  res.render("register");
})

router.post("/", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  return db
  .query(`INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *`, [username, password])
  .then((response) => {
    console.log("res", response.rows[0])
    res.redirect("/")
  })
  .catch((err) => {
    console.log(err.message);
  });
})

module.exports = router
