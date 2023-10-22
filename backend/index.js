/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { initializeDatabase } = require("./dbinit");
const donationRouter = require("./donationRouter.js");

const app = express();
const PORT = 3001;

app.use(bodyParser.json());
app.use(cors());
app.use(donationRouter);

initializeDatabase();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
