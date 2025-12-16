const express = require("express");
const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Notetaker backend running" });
});

app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`);
});
