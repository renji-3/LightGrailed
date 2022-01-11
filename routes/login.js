const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { Pool } = require("pg");
const dbParams = require("../lib/db.js");
const db = new Pool(dbParams);

router.get("/", (req, res) => {
  res.render("login")
});

router.post("/", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  return db
  .query(`SELECT * FROM users WHERE username = $1`, [username])
  .then((response) => {
    console.log("before res", response)
    if (bcrypt.compareSync(password, response.rows[0].password)) {
    console.log(req.session)
    console.log("res", response)
    }
    res.redirect("/")
  })
  .catch((err) => {
    console.log(err.message);
  });
})

module.exports = router
