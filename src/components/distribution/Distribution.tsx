import { Paper, Table, TableBody, TableContainer } from "@mui/material";
import { useEffect, useState } from "react";
import Donation from "../../types/Donation";
import { getAllDonations } from "../../utils/api";
import TableHeader from "../table/TableHeader";
import TableRowComponent from "../table/TableRowComponent";
import columns from "../table/columnsConfig";

function Distribution() {
  const [donations, setDonations] = useState<Donation[]>([]);

  useEffect(() => {
    getAllDonations().then((donations) => setDonations(donations));
  }, []);

  // TODO: add skeleton loading
  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: 500 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHeader columns={columns} />
          <TableBody>
            {donations.map((donation) => (
              <TableRowComponent
                key={donation.id}
                donation={donation}
                columns={columns}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

export default Distribution;
