const DonorService = require("./donorService");
const DonationTypeService = require("./donationTypeService");
const { donationRequestValidator } = require("../utils/validate");

const TABLE_NAME = "Donations";
const makeDonation = async (db, { name, type, quantity, date }) => {
  if (!donationRequestValidator({ name, type, quantity, date })) {
    throw new Error("Invalid donation");
  }
  const TypeID = await DonationTypeService.getId(db, type);

  const donatorId = await DonorService.getDonatorId(db, name);

  const [donationID] = await db(TABLE_NAME).insert({
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
