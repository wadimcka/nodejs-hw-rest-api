require("dotenv").config();
const app = require("./app");

require("./mongoDb");

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log("Server running. Use our API on port: 3000");
});
