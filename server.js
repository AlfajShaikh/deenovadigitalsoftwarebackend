require("dotenv").config();

const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");

const app = express();

connectDB();

app.use(cors());


app.use(express.json());

app.use("/api/home", require("./routes/homeRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/requirmentenquiry",require("./routes/requirementRoutes"))
app.use("/api/payments", require("./routes/paymentsRoutes"));

app.use("/api/estimate", require("./routes/estimateRoutes"));

app.get("/", (req, res) => {    
  res.send("API Running...");
});

app.use(
  cors({
    origin: [
      "http://localhost:5174",
      "https://alfajshaikh.github.io",
    ],
    credentials: true,
  })
);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);


});