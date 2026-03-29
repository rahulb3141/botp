const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("✅ Deployment successful! Your Node app is running on AWS EKS using Jenkins CI/CD.");
});

const PORT = process.env.PORT || 3000;


app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
