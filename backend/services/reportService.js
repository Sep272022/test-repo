const fetchReportByDonationType = async (db) => {
  return await db("DonationTypes as dt")
    .leftJoin("Donations as d", "dt.TypeID", "=", "d.TypeID")
    .leftJoin("DistributionLogs as dist", "dt.TypeID", "=", "dist.TypeID")
    .select(
      "dt.TypeName as donationType",
      db.raw("COALESCE(SUM(??), 0) as ??", ["d.Quantity", "totalReceived"]),
      db.raw("COALESCE(SUM(??), 0) as ??", [
        "dist.Quantity",
        "totalDistributed",
      ]),
      db.raw("COALESCE(SUM(??), 0) - COALESCE(SUM(??), 0) as ??", [
        "d.Quantity",
        "dist.Quantity",
        "availableAmount",
      ])
    )
    .groupBy("dt.TypeName");
};

const fetchReportByDonor = async (db) => {
  return await db("Donators as don")
    .join("Donations as d", "don.DonatorID", "d.DonatorId")
    .join("DonationTypes as dt", "d.TypeID", "dt.TypeID")
    .select(
      "don.Name as donorName",
      db.raw("SUM(CASE WHEN ?? = ? THEN ?? ELSE 0 END) as ??", [
        "dt.TypeName",
        "Food",
        "d.Quantity",
        "foodDonated",
      ]),
      db.raw("SUM(CASE WHEN ?? = ? THEN ?? ELSE 0 END) as ??", [
        "dt.TypeName",
        "Money",
        "d.Quantity",
        "moneyDonated",
      ]),
      db.raw("SUM(CASE WHEN ?? = ? THEN ?? ELSE 0 END) as ??", [
        "dt.TypeName",
        "Clothing",
        "d.Quantity",
        "clothingDonated",
      ]),
      db.raw("SUM(CASE WHEN ?? = ? THEN ?? ELSE 0 END) as ??", [
        "dt.TypeName",
        "Other",
        "d.Quantity",
        "otherDonated",
      ])
    )
    .groupBy("don.Name");
};

module.exports = {
  fetchReportByDonationType,
  fetchReportByDonor,
};
