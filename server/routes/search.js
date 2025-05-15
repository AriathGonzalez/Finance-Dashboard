// routes/textToSql.js
const express = require("express");
const axios = require("axios");
const router = express.Router();
const supabase = require("../lib/supabase");

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
    if (!sqlQuery) {
      return res
        .status(500)
        .json({ error: "No SQL query received from Diffy." });
    }

    res.json({ sqlQuery });
  } catch (err) {
    console.error(
      "Diffy API error:",
      err.response ? err.response.data : err.message
    );
    res.status(500).json({ error: "Failed to fetch data from Diffy AI." });
  }
});

router.post("/chat-bot", async (req, res) => {
  const { query, user } = req.body;
  if (!query || !user) {
    return res.status(400).json({ error: "Query and user are required." });
  }

  try {
    // Step 1: Ask Dify for the SQL call
    const sqlGenRes = await axios.post(
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
          Authorization: `Bearer ${process.env.DIFY_SQL_AGENT_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const sqlCall = sqlGenRes.data?.answer?.trim();
    if (!sqlCall) {
      return res.status(500).json({ error: "No SQL call received." });
    }

    console.log("sql call: ", sqlCall);

    const funcMatch = sqlCall.match(
      /SELECT\s+\*\s+FROM\s+(\w+)\s*\(([^)]*)\)/i
    );
    let resultData = [];

    if (funcMatch) {
      // It's a function call
      const functionName = funcMatch[1];
      const rawParams = funcMatch[2];
      const args = {};

      rawParams.split(",").forEach((param) => {
        const [key, val] = param.split(":=").map((s) => s.trim());
        if (!key || val === undefined) {
          console.warn("Invalid param:", param);
          return;
        }

        args[key] = isNaN(val) ? val.replace(/^'|'$/g, "") : Number(val);
      });

      console.log("function name: ", functionName, " args: ", args);
      const { data, error } = await supabase.rpc(functionName, args);
      if (error) {
        console.error("Supabase error:", error);
        return res.status(500).json({ error: "Database query failed." });
      }

      resultData = Array.isArray(data) ? data.slice(0, 50) : [];
    } else {
      // Not a function call — skip execution, return empty result
      resultData = [];
    }

    const resultString = JSON.stringify(resultData, null, 2).slice(0, 1999);

    console.log("result string: ", resultString);
    // Step 2: Ask Dify to explain the results
    const explainRes = await axios.post(
      "https://api.dify.ai/v1/chat-messages",
      {
        inputs: {
          sql_query_result: resultString,
        },
        query,
        response_mode: "blocking",
        conversation_id: "",
        user,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.DIFY_EXPLAINER_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const finalAnswer = explainRes.data?.answer;
    console.log("final answer: ", finalAnswer);
    res.json({
      sql_function_call: sqlCall,
      resultData,
      answer: finalAnswer,
    });
  } catch (err) {
    console.error("Error in chat-bot:", err.response?.data || err.message);
    res.status(500).json({ error: "Unexpected error in chat-bot route." });
  }
});

module.exports = router;
