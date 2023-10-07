import { Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import Donation from "../../types/Donation";
import { getAllDonations } from "../../utils/api";
import columns from "../table/columnsConfig";

function Distribution() {
  const [donations, setDonations] = useState<Donation[]>([]);

  useEffect(() => {
    getAllDonations().then((donations) => setDonations(donations));
  }, []);

  // TODO: add skeleton loading
  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      <DataGrid rows={donations} columns={columns} autoHeight />
    </Box>
  );
}

export default Distribution;
