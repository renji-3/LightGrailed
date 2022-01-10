// const express = require('express');
// const router = express.Router();
// const { Pool } = require("pg");
// const dbParams = require("../lib/db.js");
// const db = new Pool(dbParams);

// router.get("/", (req, res) => {
//     res.render("favourites");
//   });

// router.get("/", (req, res) => {
//     const queryString = `
//       SELECT * FROM favourites
//       JOIN products ON product_id = products.id
//       WHERE product_id = 1;
//     `
//     db.query(queryString)
//       .then(response => {
//         const templateVars = { products: response.rows }
//         res.render("favourites", templateVars);
//       })
//       .catch((err) => {
//       console.log(err.message);
//     });
// });

// router.post("/delete", (req, res) => {
//     const userID = req.session.userID;
//     const productID = req.body.productID;

//     const queryString = `DELETE FROM favourites WHERE user_id = $1 AND product_id = $2 RETURNING *;`

//     db.query(queryString, [userID, productID])
//     .then(response => {
//       res.redirect("/")
//     })
//     .catch((err) => {
//       console.log(err.message);
//     });
//   });

// module.exports = router;

// // Logic for adding favouriting product?

// $(() => {
//     $('.fav-heart-icon').click((event) => { //Click heart icon
//       if ($(event.target).data("id") === "un-fav-heart") { //Current heart icon is not favourited
//         event.preventDefault();
//         $(event.target).removeClass("un fav-heart").addClass("fav red-heart").css("color", "red");
//         $(event.target).data('id', "fav-red-heart"); //Set ID to fav-red-heart

//         $.post("/favourites", { productID: $(event.target).data("item") })
//           .done((response) => {
//           console.log(response);
//           })
//         } else { //Current heart is favourited and we unfavourite it
//           event.preventDefault();
//           $(event.target).removeClass("fav red-heart").addClass("un fav-heart")
//           $(event.target).data('id', "un-fav-heart") //Set heart id as unfav

//           $.post("/favourites/delete", { productID: $(event.target).data("item")})
//             .done(() => {
//             console.log("Remove item from favourites");
//           })
//         }
//       })
//     });


//     // INSERT INTO favourites (user_id, product_id)
//     // VALUES (1,1);
