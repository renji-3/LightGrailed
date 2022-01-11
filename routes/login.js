const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const cookieSession = require('cookie-session');
const { Pool } = require("pg");
const dbParams = require("../lib/db.js");
const db = new Pool(dbParams);

router.get("/", (req, res) => {
  res.render("login")
});

// const getUsername = function(username) {
//   return db
//   .query(`SELECT * FROM users WHERE username = $1`, [username])
//   .then((response) => response.rows[0])
//   .catch((err) => {
//     console.log(err.message);
//   });
// }

// const login = function(username, password) {
//   return db.getUsername(username)
//   .then(user => {
//     if (bcrypt.compareSync(password, user.password)) {
//       return user;
//     }
//     return null;
//   });
// }

router.post("/", (req, res) => {
  console.log("cookie:", req.session)
  console.log("body:", req.body)
  const username = req.body.username;
  const password = req.body.password;

//   login(email, password)
//     .then(user => {
//       if (!user) {
//         res.send({error: "error"});
//         return;
//       }
//       req.session.userId = user.userId
//       res.redirect("/")
//     })

  return db
  .query(`SELECT * FROM users WHERE username = $1`, [username])
  .then((response) => {
    if (bcrypt.compareSync(password, response.rows[0].password)) {
      console.log("res", response.rows[0]);
      req.session.userID = response.rows[0].id;
      console.log(req.session);
      res.redirect("/");
    } 
    else console.log('BAD PASS!')
  })
  .catch((err) => {
    console.log(err.message);
  });
})

module.exports = router;
