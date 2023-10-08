import { Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import Donation from "../../types/Donation";
import { getAllDistributions } from "../../utils/apiClient";
import { columns } from "../table/columnsConfig";

function Distribution() {
  const [distributions, setDistributions] = useState<Donation[]>([]);

  useEffect(() => {
    getAllDistributions().then((distributions) =>
      setDistributions(distributions)
    );
  }, []);

  return (
    <Box sx={{ width: "100%" }}>
      <DataGrid
        rows={distributions}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        pageSizeOptions={[10, 25, 50]}
        disableRowSelectionOnClick
        autoHeight
      />
    </Box>
  );
}

export default Distribution;
