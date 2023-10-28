/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { initializeDatabase, knex } = require("./db/dbinit");
const DonationController = require("./controllers/donationController");
const DistributionController = require("./controllers/distributionController");
const ReportController = require("./controllers/reportController");

const app = express();
const PORT = 3001;

app.use(bodyParser.json());
app.use(cors());

initializeDatabase();

// TODO: add a logger middleware here

app.post("/donate", DonationController.postDonation(knex));
app.get("/distributions", DistributionController.getDistributions(knex));
app.get("/reports/donations", ReportController.getReportByType(knex));
app.get("/reports/donors", ReportController.getReportByDonor(knex));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// For testing purposes
module.exports = app;
