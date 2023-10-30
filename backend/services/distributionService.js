const { renameKeys } = require("../utils/renameKeys");

const TABLE_NAME = "DistributionLogs";
const fetchDistributions = async (db) => {
  const rows = await db(TABLE_NAME)
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
    );

  const distributionKeys = {
    LogID: "id",
    TypeName: "type",
    Quantity: "quantity",
    DateDistributed: "date",
  };

  return rows.map((row) => renameKeys(row, distributionKeys));
};

module.exports = {
  fetchDistributions,
};
