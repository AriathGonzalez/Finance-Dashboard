const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const searchRoute = require("./routes/search");
const dataRoutes = require("./routes/data");
const expensesRoutes = require("./routes/expenses");

dotenv.config();
const app = express();
const port = 3001;

// Allow CORS from your frontend
app.use(
  cors({
    origin: "http://localhost:9002", // or '*' to allow all (not recommended for prod)
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use("/", searchRoute);
app.use("/data", dataRoutes);
app.use("/expenses", expensesRoutes);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
