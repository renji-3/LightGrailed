const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { Pool } = require("pg");
const dbParams = require("../lib/db.js");
const db = new Pool(dbParams);

router.get("/", (req, res) => {
  const username = req.session.username;
  const user_id = req.session.userID
  const templateVars = {
    user: user_id,
    username: username
  }
  res.render("register", templateVars);
})

router.post("/", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  return db
  .query(`INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *`, [username, bcrypt.hashSync(password, 10)])
  .then((response) => {
    console.log("res", response.rows[0])
    res.redirect("/")
  })
  .catch((err) => {
    console.log(err.message);
  });
})

module.exports = router
