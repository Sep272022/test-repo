import { Box } from "@mui/material";
import ReportByDonor from "./ReportByDonor";
import ReportByType from "./ReportByType";

function Reports() {
  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      <ReportByType />
      <ReportByDonor />
    </Box>
  );
}

export default Reports;
