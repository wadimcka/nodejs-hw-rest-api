require("dotenv").config();
const app = require("./app");

require("./mongoDb");

app.listen(3000, () => {
  console.log("Server running. Use our API on port: 3000");
});
