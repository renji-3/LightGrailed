const express = require('express');
const router  = express.Router();

router.get("/messagethreads/:id", (req, res) => { //Display specific conversation

  const queryString = `
    SELECT * FROM messages 
    WHERE message_thread_id = $1
  `
  const messagethreadID = req.params.id;
  
  db.query(queryString, [messagethreadID])
  .then(data => {
    const templateVars = { messages: data.rows, messagethread_id: messagethreadID }
    console.log("MESSAGES: ", templateVars.messages)
    res.render("messages", templateVars);
  })
});

 router.post("/:id", (req, res) => { //Send message 
    const messagethreadID = req.params.id;
    const senderID = req.session.userID;
    const messageContent = req.body.message;

    const queryString1 = `
      SELECT from_user FROM messagethreads 
      WHERE id = $1
    `
    db.query(queryString1, [messagethreadID])
      .then(response => {
        const buyerID = response.rows[0].from_user;
        let from_buyer = false //Assume that message is not from buyer
        console.log(senderID, buyerID);

        if (senderID === buyerID) from_buyer = true;
      
      //Save message into db
      const queryString2 = ` 
        INSERT INTO messages (from_buyer, message_thread_id, message_content) 
        VALUES ($1, $2, $3)
      `

      const queryParams = [from_buyer, messagethreadID, messageContent];

      db.query(queryString2, queryParams)
      .then(response => {
        res.redirect(`messagethreads/${messagethreadID}`)
      })
      .catch((err) => console.log(err.message));
    })
  })
