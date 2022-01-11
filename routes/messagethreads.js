const express = require('express');
const router  = express.Router();

router.get("/messagethreads", (req, res) => {
    const queryString1 = `
      SELECT messagethreads.*, products.product_name, products.seller_id FROM messagethreads 
      JOIN products ON products.id = messagethreads.product_id 
      WHERE from_user = $1
    `
        
    db.query(queryString1, [req.session.userID])
    .then(response => {
      const templateVars = { messagethreads: response.rows };
      res.render("messagethreads", templateVars);
    })
  });

router.post("/messagethreads", (req, res) => { //Route is called when buyer messages seller on product page
    const queryString = `
      INSERT INTO messagethraeds (from_user, product_id) 
      VALUES ($1, $2) RETURNING id
    `
    const queryValues = [req.session.userID, req.body.item_id];
    
    console.log("New message thread by user: ", queryValues[0], "Concerning product:", queryValues[1])
    
    db.query(queryString, queryValues)
      .then(data => {
        console.log("conversation id", data.rows[0])
        const messagethreadID = data.rows[0].id;
        res.redirect(`/messagethreads/${messagethreadID}`)
      })
})

module.exports = router;
