const ReportService = require("../services/reportService");

const getReportByType = (db) => async (req, res) => {
  try {
    const report = await ReportService.fetchReportByDonationType(db);
    return res.json(report);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getReportByDonor = (db) => async (req, res) => {
  try {
    const report = await ReportService.fetchReportByDonor(db);
    return res.json(report);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getReportByType,
  getReportByDonor,
};
