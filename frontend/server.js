const express = require("express");
const path = require("path");

const app = express();

app.use(express.static(path.join(__dirname));

app.listen(3000, "0.0.0.0", () => {
  console.log("Frontend running on port 3000");
});
