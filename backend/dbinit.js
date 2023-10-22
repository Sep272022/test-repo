/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const knex = require("knex")({
  client: "sqlite3",
  connection: {
    filename: "./database.db",
  },
});

const donationTypes = require("./donationTypes");

/**
 * Initializes the database by creating necessary tables if they don't exist.
 * Also checks if DonationTypes exist in the table.
 */
async function initializeDatabase() {
  await createDonationTypesTable();
  await createDonationTable();
  await createDistributionLogsTable();
  await createDonatorsTable();
  console.log("Database initialization completed.");
  await checkIfDonationTypesExist();
}

/**
 * Creates a table with the given name and structure if it does not already exist in the database.
 * @param tableName - The name of the table to create.
 * @param tableStructure - The function that defines the structure of the table.
 * @returns A Promise that resolves when the table is created or if it already exists.
 */
async function createTableIfNotExists(tableName, tableStructure) {
  const tableExists = await knex.schema.hasTable(tableName);
  if (!tableExists) {
    await knex.schema.createTable(tableName, tableStructure);
  }
}

async function createDonatorsTable() {
  await createTableIfNotExists("Donators", (table) => {
    table.increments("DonatorID").primary();
    table.string("Name").notNullable();
  });
}

async function createDistributionLogsTable() {
  await createTableIfNotExists("DistributionLogs", (table) => {
    table.increments("LogID").primary();
    table.integer("TypeID");
    table.float("Quantity").notNullable();
    table.date("DateDistributed").defaultTo(knex.fn.now());
    table.foreign("TypeID").references("DonationTypes.TypeID");
  });
}

async function createDonationTable() {
  await createTableIfNotExists("Donations", (table) => {
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

async function createDonationTypesTable() {
  await createTableIfNotExists("DonationTypes", (table) => {
    table.increments("TypeID").primary();
    table.string("TypeName").notNullable().unique();
  });
}

/**
 * Checks if there are any existing donation types in the database.
 * If there are no existing donation types, it adds initial donation types.
 */
async function checkIfDonationTypesExist() {
  const donationTypes = await knex("DonationTypes").select("TypeID");
  if (donationTypes.length === 0) {
    addInitialDonationTypes();
  }
}

/**
 * Adds initial donation types to the DonationTypes table in the database.
 */
async function addInitialDonationTypes() {
  await knex("DonationTypes").insert(donationTypes);
  console.log("Initial donation types added.");
}

module.exports = {
  initializeDatabase,
  knex,
};
