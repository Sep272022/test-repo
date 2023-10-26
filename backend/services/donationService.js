/**
 * Retrieves the DonatorID associated with the given donatorName.
 * If the donatorName does not exist in the database, a new Donator is added and its DonatorID is returned.
 * @param donatorName - The name of the donator to retrieve the DonatorID for.
 * @param db - The database connection.
 * @returns A Promise that resolves with the DonatorID
 */
function getDonatorId(donatorName, db) {
  return db("Donators")
    .where({ Name: donatorName })
    .first()
    .then((row) => {
      if (!row) {
        return addDonator(donatorName, db);
      } else {
        return row.DonatorID;
      }
    });
}

/**
 * Adds a new donator to the database.
 * @param donatorName - The name of the donator to be added.
 * @param db - The database connection.
 * @returns A Promise that resolves with the ID of the newly added donator.
 */
function addDonator(donatorName, db) {
  return db("Donators")
    .insert({ Name: donatorName })
    .then((ids) => {
      console.log("Donator added.");
      return ids[0];
    });
}

const makeDonation = async (db, { name, type, quantity, date }) => {
  const { TypeID } = await db("DonationTypes")
    .where({ TypeName: type })
    .first();

  if (!TypeID) {
    throw new Error("Invalid typeName provided");
  }
  const donatorId = await getDonatorId(name, db);

  const [donationID] = await db("Donations").insert({
    TypeID,
    DonatorId: donatorId,
    Quantity: quantity,
    DonationDate: date,
  });

  return { donationID };
};

module.exports = {
  makeDonation,
};
