const TABLE_NAME = "Donators";
/**
 * Retrieves the DonatorID associated with the given donatorName.
 * If the donatorName does not exist in the database, a new Donator is added and its DonatorID is returned.
 * @param donatorName - The name of the donator to retrieve the DonatorID for.
 * @param db - The database connection.
 * @returns A Promise that resolves with the DonatorID
 */
const getDonatorId = async (db, donatorName) => {
  return db(TABLE_NAME)
    .where({ Name: donatorName })
    .first()
    .then((row) => {
      if (!row) {
        return addDonator(db, donatorName);
      } else {
        return row.DonatorID;
      }
    });
};

/**
 * Adds a new donator to the database.
 * @param donatorName - The name of the donator to be added.
 * @param db - The database connection.
 * @returns A Promise that resolves with the ID of the newly added donator.
 */
const addDonator = async (db, donatorName) => {
  return db(TABLE_NAME)
    .insert({ Name: donatorName })
    .then((ids) => {
      console.log("Donator added.");
      return ids[0];
    });
};

module.exports = {
  getDonatorId,
  addDonator,
};
