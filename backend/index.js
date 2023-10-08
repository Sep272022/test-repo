/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 3001;

app.use(bodyParser.json());
app.use(cors());

const knex = require("knex")({
  client: "sqlite3",
  connection: {
    filename: "./database.db",
  },
});

initializeDatabase();

async function initializeDatabase() {
  await knex.schema.hasTable("DonationTypes").then((exists) => {
    if (!exists) {
      return knex.schema.createTable("DonationTypes", (table) => {
        table.increments("TypeID").primary();
        table.string("TypeName").notNullable().unique();
      });
    }
  });

  await knex.schema.hasTable("Donations").then((exists) => {
    if (!exists) {
      return knex.schema.createTable("Donations", (table) => {
        table.increments("DonationID").primary();
        table.integer("TypeID").notNullable();
        table.integer("DonatorId").notNullable();
        table.float("Quantity").notNullable();
        table.date("DonationDate").notNullable();
        table.date("DateSubmitted").defaultTo(knex.fn.now());
        table.foreign("TypeID").references("DonationTypes.TypeID");
        table.foreign("DonatorId").references("Donators.DonatorId");
      });
    }
  });

  await knex.schema.hasTable("DistributionLogs").then((exists) => {
    if (!exists) {
      return knex.schema.createTable("DistributionLogs", (table) => {
        table.increments("LogID").primary();
        table.integer("TypeID");
        table.float("Quantity").notNullable();
        table.date("DateDistributed").defaultTo(knex.fn.now());
        table.foreign("TypeID").references("DonationTypes.TypeID");
      });
    }
  });

  await knex.schema.hasTable("Donators").then((exists) => {
    if (!exists) {
      return knex.schema.createTable("Donators", (table) => {
        table.increments("DonatorID").primary();
        table.string("Name").notNullable();
      });
    }
  });

  console.log("Database initialization completed.");
  await checkIfDonationTypesExist();
}

async function checkIfDonationTypesExist() {
  const donationTypes = await knex("DonationTypes").select("TypeID");
  if (donationTypes.length === 0) {
    addInitialDonationTypes();
  }
}

async function addInitialDonationTypes() {
  await knex("DonationTypes").insert([
    { TypeName: "Food" },
    { TypeName: "Clothing" },
    { TypeName: "Money" },
    { TypeName: "Other" },
  ]);
  console.log("Initial donation types added.");
}

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

function addDonator(donatorName) {
  return knex("Donators")
    .insert({ Name: donatorName })
    .then((ids) => {
      console.log("Donator added.");
      return ids[0];
    });
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.post("/donate", async (req, res) => {
  const { name, type, quantity, date } = req.body;
  console.log("req.body", req.body);

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
    console.log("donatorId", donatorId);
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
      "dt.TypeName as Donation Type",
      knex.raw("COALESCE(SUM(??), 0) as ??", ["d.Quantity", "Total Received"]),
      knex.raw("COALESCE(SUM(??), 0) as ??", [
        "dist.Quantity",
        "Total Distributed",
      ]),
      knex.raw("COALESCE(SUM(??), 0) - COALESCE(SUM(??), 0) as ??", [
        "d.Quantity",
        "dist.Quantity",
        "Available Amount",
      ])
    )
    .groupBy("dt.TypeName")
    .then((rows) => {
      const donationReportKeys = {
        "Donation Type": "donationType",
        "Total Received": "totalReceived",
        "Total Distributed": "totalDistributed",
        "Available Amount": "availableAmount",
      };

      const donationReport = rows.map((row) =>
        renameKeys(row, donationReportKeys)
      );
      return res.json(donationReport);
    });
});

app.get("/reports/donors", (req, res) => {
  knex("Donators as don")
    .join("Donations as d", "don.DonatorID", "d.DonatorId")
    .join("DonationTypes as dt", "d.TypeID", "dt.TypeID")
    .select(
      "don.Name as Donors Name",
      knex.raw("SUM(CASE WHEN ?? = ? THEN ?? ELSE 0 END) as ??", [
        "dt.TypeName",
        "Food",
        "d.Quantity",
        "Food Donated",
      ]),
      knex.raw("SUM(CASE WHEN ?? = ? THEN ?? ELSE 0 END) as ??", [
        "dt.TypeName",
        "Money",
        "d.Quantity",
        "Money Donated",
      ]),
      knex.raw("SUM(CASE WHEN ?? = ? THEN ?? ELSE 0 END) as ??", [
        "dt.TypeName",
        "Clothing",
        "d.Quantity",
        "Clothing Donated",
      ]),
      knex.raw("SUM(CASE WHEN ?? = ? THEN ?? ELSE 0 END) as ??", [
        "dt.TypeName",
        "Other",
        "d.Quantity",
        "Other Donated",
      ])
    )
    .groupBy("don.Name")
    .then((row) => {
      const donatorReportKeys = {
        "Donors Name": "donorName",
        "Food Donated": "foodDonated",
        "Money Donated": "moneyDonated",
        "Clothing Donated": "clothingDonated",
        "Other Donated": "otherDonated",
      };

      const donatorReport = row.map((row) =>
        renameKeys(row, donatorReportKeys)
      );
      return res.json(donatorReport);
    });
});
