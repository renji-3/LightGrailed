const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { Pool } = require("pg");
const dbParams = require("../lib/db.js");
const db = new Pool(dbParams);

router.get("/", (req, res) => {
  const username = req.session.username;
  const user_id = req.session.userID;
  const templateVars = {
    user: user_id,
    username: username
  };
  res.render("login", templateVars);
});

router.post("/", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  return db
    .query(`SELECT * FROM users WHERE username = $1`, [username])
    .then((response) => {
      if (bcrypt.compareSync(password, response.rows[0].password)) {
        console.log("res", response.rows[0]);
        req.session.userID = response.rows[0].id;
        req.session.username = username;
        console.log(req.session);
        res.redirect("/");
      } else console.log('BAD PASS!');
    })
    .catch((err) => {
      console.log(err.message);
    });
});

module.exports = router;
