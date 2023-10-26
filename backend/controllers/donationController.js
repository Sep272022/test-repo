const DonationService = require("../services/donationService");
const { donationRequestValidator } = require("../utils/validate");

const postDonation = (db) => async (req, res) => {
  if (!donationRequestValidator(req.body)) {
    return res.status(400).json({ error: "Invalid donation request" });
  }

  const { name, type, quantity, date } = req.body;

  if (!type || !quantity) {
    return res.status(400).json({ error: "type and quantity are required" });
  }

  try {
    const { donationID } = await DonationService.makeDonation(db, {
      name,
      type,
      quantity,
      date,
    });
    res.json({ donationID });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  postDonation,
};
