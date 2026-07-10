require("dotenv").config();

const express = require("express");
const connectDB = require("./config/db");

const app = express();

connectDB();

app.use(express.json());

app.use("/api/home", require("./routes/homeRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/requirmentenquiry",require("./routes/requirementRoutes"))
app.use("/api/payments", require("./routes/paymentsRoutes"));

app.use("/api/estimate", require("./routes/estimateRoutes"));

app.get("/", (req, res) => {    
  res.send("API Running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});