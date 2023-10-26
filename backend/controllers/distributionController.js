const DistributionService = require("../services/distributionService");

const getDistributions = (db) => async (req, res) => {
  try {
    const distributions = await DistributionService.fetchDistributions(db);
    return res.json(distributions);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getDistributions,
};
