const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const authRoutes = require("./routes/auth");
const leaveRoutes = require("./routes/leave");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

// Routes
app.use("/auth", authRoutes);
app.use("/leave", leaveRoutes);
app.use("/public", express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/login.html");
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
