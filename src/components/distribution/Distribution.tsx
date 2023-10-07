import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useEffect, useState } from "react";
import Donation from "../../types/Donation";
import { getAllDonations } from "../../utils/api";

interface Column {
  id: keyof Donation;
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: number) => string;
}

const column: Column[] = [
  { id: "name", label: "Donor's Name", minWidth: 170 },
  { id: "type", label: "Donation Type", minWidth: 100 },
  { id: "quantity", label: "Quantity", minWidth: 100 },
  { id: "date", label: "Date", minWidth: 100 },
];

function Distribution() {
  const [donations, setDonations] = useState<Donation[]>([]);

  useEffect(() => {
    getAllDonations().then((donations) => setDonations(donations));
  }, []);

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            {column.map((column) => (
              <TableCell
                key={column.id}
                align={column.align}
                style={{ minWidth: column.minWidth }}
              >
                {column.label}
              </TableCell>
            ))}
          </TableHead>
          <TableBody>
            {donations.map((donation: Donation) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={donation.id}>
                  {column.map((column) => {
                    const value = donation[column.id];
                    return (
                      <TableCell key={column.id} align={column.align}>
                        {column.format && typeof value === "number"
                          ? column.format(value)
                          : value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

export default Distribution;
