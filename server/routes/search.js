
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
        conversation_id: "", // Consider managing conversation_id for context
        user,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.DIFFY_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const sqlQuery = response.data?.answer;
    // Assuming dify.ai might return an explanation field.
    // If not, this will be undefined, and the frontend should handle it.
    const naturalLanguageExplanation = response.data?.explanation; 

    if (!sqlQuery) {
      return res.status(500).json({ error: "No SQL query received from Diffy." });
    }

    res.json({ sqlQuery, naturalLanguageExplanation });
  } catch (err) {
    console.error("Diffy API error:", err.response ? err.response.data : err.message);
    res.status(500).json({ error: "Failed to fetch data from Diffy AI." });
  }
});

module.exports = router;
