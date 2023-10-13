/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { knex, initializeDatabase } = require("./dbinit");
const { donationRequestValidator } = require("./validate");

const app = express();
const PORT = 3001;

app.use(bodyParser.json());
app.use(cors());

initializeDatabase();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

/**
 * Retrieves the DonatorID associated with the given donatorName.
 * If the donatorName does not exist in the database, a new Donator is added and its DonatorID is returned.
 * @param donatorName - The name of the donator to retrieve the DonatorID for.
 * @returns A Promise that resolves with the DonatorID
 */
function getDonatorId(donatorName) {
  return knex("Donators")
    .where({ Name: donatorName })
    .first()
    .then((row) => {
      if (!row) {
        return addDonator(donatorName);
      } else {
        return row.DonatorID;
      }
    });
}

/**
 * Adds a new donator to the database.
 * @param donatorName - The name of the donator to be added.
 * @returns A Promise that resolves with the ID of the newly added donator.
 */
function addDonator(donatorName) {
  return knex("Donators")
    .insert({ Name: donatorName })
    .then((ids) => {
      console.log("Donator added.");
      return ids[0];
    });
}
app.post("/donate", async (req, res) => {
  if (!donationRequestValidator(req.body)) {
    return res.status(400).json({ error: "Invalid donation request" });
  }

  const { name, type, quantity, date } = req.body;

  if (!type || !quantity) {
    return res.status(400).json({ error: "type and quantity are required" });
  }

  try {
    const { TypeID } = await knex("DonationTypes")
      .where({ TypeName: type })
      .first();
    if (!TypeID) {
      return res.status(400).json({ error: "Invalid typeName provided" });
    }
    const donatorId = await getDonatorId(name);
    const [donationID] = await knex("Donations").insert({
      TypeID,
      DonatorId: donatorId,
      Quantity: quantity,
      DonationDate: date,
    });
    res.json({ donationID });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Renames keys of an object based on a key mapping.
 * @param obj - The object whose keys will be renamed.
 * @param keyMapping - An object that maps old keys to new keys.
 * @returns A new object with the renamed keys.
 */
function renameKeys(obj, keyMapping) {
  return Object.keys(obj).reduce((acc, key) => {
    return {
      ...acc,
      [keyMapping[key] || key]: obj[key],
    };
  }, {});
}

app.get("/donations", (req, res) => {
  knex("Donations")
    .join("Donators", "Donators.DonatorID", "=", "Donations.DonatorId")
    .join("DonationTypes", "DonationTypes.TypeID", "=", "Donations.TypeID")
    .select(
      "Donations.DonationID",
      "Donators.Name",
      "DonationTypes.TypeName",
      "Donations.Quantity",
      "Donations.DonationDate",
      "Donations.DateSubmitted"
    )
    .then((rows) => {
      const donationKeys = {
        DonationID: "id",
        Name: "name",
        TypeName: "type",
        Quantity: "quantity",
        DonationDate: "date",
        DateSubmitted: "dateSubmitted",
      };

      const donations = rows.map((row) => renameKeys(row, donationKeys));
      return res.json(donations);
    })
    .catch((error) => {
      return res.status(500).json({ error: error.message });
    });
});

app.get("/distributions", (req, res) => {
  knex("DistributionLogs")
    .join(
      "DonationTypes",
      "DonationTypes.TypeID",
      "=",
      "DistributionLogs.TypeID"
    )
    .select(
      "DistributionLogs.LogID",
      "DonationTypes.TypeName",
      "DistributionLogs.Quantity",
      "DistributionLogs.DateDistributed"
    )
    .then((rows) => {
      const distributionKeys = {
        LogID: "id",
        TypeName: "type",
        Quantity: "quantity",
        DateDistributed: "date",
      };

      const distributions = rows.map((row) =>
        renameKeys(row, distributionKeys)
      );
      return res.json(distributions);
    })
    .catch((error) => {
      return res.status(500).json({ error: error.message });
    });
});

app.get("/reports/donations", (req, res) => {
  knex("DonationTypes as dt")
    .leftJoin("Donations as d", "dt.TypeID", "=", "d.TypeID")
    .leftJoin("DistributionLogs as dist", "dt.TypeID", "=", "dist.TypeID")
    .select(
      "dt.TypeName as donationType",
      knex.raw("COALESCE(SUM(??), 0) as ??", ["d.Quantity", "totalReceived"]),
      knex.raw("COALESCE(SUM(??), 0) as ??", [
        "dist.Quantity",
        "totalDistributed",
      ]),
      knex.raw("COALESCE(SUM(??), 0) - COALESCE(SUM(??), 0) as ??", [
        "d.Quantity",
        "dist.Quantity",
        "availableAmount",
      ])
    )
    .groupBy("dt.TypeName")
    .then((rows) => {
      return res.json(rows);
    });
});

app.get("/reports/donors", (req, res) => {
  knex("Donators as don")
    .join("Donations as d", "don.DonatorID", "d.DonatorId")
    .join("DonationTypes as dt", "d.TypeID", "dt.TypeID")
    .select(
      "don.Name as donorName",
      knex.raw("SUM(CASE WHEN ?? = ? THEN ?? ELSE 0 END) as ??", [
        "dt.TypeName",
        "Food",
        "d.Quantity",
        "foodDonated",
      ]),
      knex.raw("SUM(CASE WHEN ?? = ? THEN ?? ELSE 0 END) as ??", [
        "dt.TypeName",
        "Money",
        "d.Quantity",
        "moneyDonated",
      ]),
      knex.raw("SUM(CASE WHEN ?? = ? THEN ?? ELSE 0 END) as ??", [
        "dt.TypeName",
        "Clothing",
        "d.Quantity",
        "clothingDonated",
      ]),
      knex.raw("SUM(CASE WHEN ?? = ? THEN ?? ELSE 0 END) as ??", [
        "dt.TypeName",
        "Other",
        "d.Quantity",
        "otherDonated",
      ])
    )
    .groupBy("don.Name")
    .then((rows) => {
      return res.json(rows);
    });
});
