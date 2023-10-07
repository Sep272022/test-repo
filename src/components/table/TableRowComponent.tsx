import TableCell from "@mui/material/TableCell/TableCell";
import TableRow from "@mui/material/TableRow/TableRow";
import { Column } from "../../types/Column";
import Donation from "../../types/Donation";

interface TableRowComponentProps {
  donation: Donation;
  columns: Column[];
}

function TableRowComponent({ donation, columns }: TableRowComponentProps) {
  return (
    <TableRow hover role="checkbox" tabIndex={-1} key={donation.id}>
      {columns.map((column) => {
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
}

export default TableRowComponent;
