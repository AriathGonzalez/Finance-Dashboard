// routes/textToSql.js
const express = require("express");
const axios = require("axios");
const router = express.Router();
require("dotenv").config();

router.post("/search", async (req, res) => {
  const { query, user } = req.body;
  console.log("query: ", query, " user: ", user);
  if (!query || !user) {
    return res.status(400).json({ error: "Query and user are required." });
  }

  try {
    const response = await axios.post(
      "https://api.dify.ai/v1/chat-messages",
      {
        inputs: {},
        query,
        response_mode: "blocking",
        conversation_id: "",
        user,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.DIFFY_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const answer = response.data?.answer;

    if (!answer) {
      return res.status(500).json({ error: "No answer received from Diffy." });
    }

    res.json({ answer });
  } catch (err) {
    console.error("Diffy API error:", err.message);
    res.status(500).json({ error: "Failed to fetch SQL from Diffy." });
  }
});

module.exports = router;
