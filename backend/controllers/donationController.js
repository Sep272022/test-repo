const DonationService = require("../services/donationService");
const { donationRequestValidator } = require("../utils/validate");

const postDonation = (db) => async (req, res) => {
  if (!donationRequestValidator(req.body)) {
    return res.status(400).json({ error: "Invalid donation request" });
  }

  try {
    const { donationID } = await DonationService.makeDonation(db, req.body);
    res.status(200).json({ donationID });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  postDonation,
};
