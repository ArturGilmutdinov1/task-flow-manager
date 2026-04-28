const express = require("express");
const { createHttpRouter } = require("./http/routers");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(createHttpRouter());

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Backend is running on http://localhost:${PORT}`);
});
