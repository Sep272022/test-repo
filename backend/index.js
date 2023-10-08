/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const express = require("express");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
const PORT = 3001;

app.use(bodyParser.json());
app.use(cors());

const db = new sqlite3.Database("./database.db", (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Connected to the SQLite database.");

  initializeDatabase();
});

function initializeDatabase() {
  const createDonationTypesTable = `
    CREATE TABLE IF NOT EXISTS DonationTypes (
      TypeID INTEGER PRIMARY KEY AUTOINCREMENT,
      TypeName TEXT NOT NULL UNIQUE
    );
  `;

  const createDonationsTable = `
    CREATE TABLE IF NOT EXISTS Donations (
      DonationID INTEGER PRIMARY KEY AUTOINCREMENT,
      TypeID INTEGER NOT NULL,
      DonatorId INTEGER NOT NULL,
      Quantity REAL NOT NULL,
      DonationDate DATE NOT NULL,
      DateSubmitted DATE DEFAULT CURRENT_DATE,
      FOREIGN KEY(TypeID) REFERENCES DonationTypes(TypeID),
      FOREIGN KEY(DonatorId) REFERENCES Donators(DonatorId)
    );
  `;

  const createDistributionLogsTable = `
    CREATE TABLE IF NOT EXISTS DistributionLogs (
      LogID INTEGER PRIMARY KEY AUTOINCREMENT,
      TypeID INTEGER,
      Quantity REAL NOT NULL,
      DateDistributed DATE DEFAULT CURRENT_DATE,
      FOREIGN KEY(TypeID) REFERENCES DonationTypes(TypeID)
    );
  `;

  const createDonatorsTable = `
    CREATE TABLE IF NOT EXISTS Donators (
      DonatorID INTEGER PRIMARY KEY AUTOINCREMENT,
      Name TEXT NOT NULL
    );
  `;

  db.exec(createDonationTypesTable);
  db.exec(createDonationsTable);
  db.exec(createDistributionLogsTable);
  db.exec(createDonatorsTable);

  console.log("Database initialization completed.");
  checkIfDonationTypesExist();
}

function checkIfDonationTypesExist() {
  const sql = `SELECT COUNT(*) AS count FROM DonationTypes`;

  db.get(sql, [], (err, row) => {
    if (err) {
      return console.error(err.message);
    }

    if (row.count === 0) {
      addInitialDonationTypes();
    }
  });
}

function addInitialDonationTypes() {
  const insertSql = `
    INSERT INTO DonationTypes (TypeName)
    VALUES (?)
  `;

  db.run(insertSql, ["Food"]);
  db.run(insertSql, ["Clothing"]);
  db.run(insertSql, ["Money"]);
  db.run(insertSql, ["Other"]);

  console.log("Initial donation types added.");
}

function getDonatorId(donatorName) {
  return new Promise((resolve, reject) => {
    const sql = `SELECT DonatorID FROM Donators WHERE Name = ?`;
    db.get(sql, [donatorName], (err, row) => {
      if (err) {
        reject(err.message);
      } else if (!row) {
        addDonator(donatorName).then(resolve).catch(reject);
      } else {
        resolve(row.DonatorID);
      }
    });
  });
}

function addDonator(donatorName) {
  return new Promise((resolve, reject) => {
    const insertSql = `
      INSERT INTO Donators (Name)
      VALUES (?)
    `;
    db.run(insertSql, [donatorName], function (err) {
      if (err) {
        reject(err.message);
      } else {
        console.log("Donator added.");
        resolve(this.lastID);
      }
    });
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
    const sql = `SELECT TypeID FROM DonationTypes WHERE TypeName = ?`;
    const { TypeID } = await new Promise((resolve, reject) => {
      db.get(sql, [type], (err, row) => {
        if (err) {
          reject(err.message);
        } else if (!row) {
          reject(`No donation type found with name ${type}`);
        } else {
          resolve(row);
        }
      });
    });

    if (!TypeID) {
      return res.status(400).json({ error: "Invalid typeName provided" });
    }

    const donatorId = await getDonatorId(name);
    console.log("donatorId", donatorId);

    const insertSql = `
      INSERT INTO Donations (TypeID, DonatorId, Quantity, DonationDate, DateSubmitted)
      VALUES (?, ?, ?, ?, CURRENT_DATE)
    `;

    db.run(insertSql, [TypeID, donatorId, quantity, date], function (err) {
      if (err) {
        throw err;
      }
      res.json({ donationID: this.lastID });
    });
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
  const sql = `
    SELECT Donations.DonationID, Donators.Name, DonationTypes.TypeName, Donations.Quantity, Donations.DonationDate, Donations.DateSubmitted
    FROM Donations
    INNER JOIN Donators ON Donators.DonatorID = Donations.DonatorId
    INNER JOIN DonationTypes ON DonationTypes.TypeID = Donations.TypeID
  `;

  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

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
  });
});

app.get("/distributions", (req, res) => {
  const sql = `
    SELECT DistributionLogs.LogID, DonationTypes.TypeName, DistributionLogs.Quantity, DistributionLogs.DateDistributed
    FROM DistributionLogs
    INNER JOIN DonationTypes ON DonationTypes.TypeID = DistributionLogs.TypeID
  `;

  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const distributionKeys = {
      LogID: "id",
      TypeName: "type",
      Quantity: "quantity",
      DateDistributed: "date",
    };

    const distributions = rows.map((row) => renameKeys(row, distributionKeys));
    return res.json(distributions);
  });
});
