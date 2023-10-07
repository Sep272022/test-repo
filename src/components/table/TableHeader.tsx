import TableCell from "@mui/material/TableCell/TableCell";
import TableHead from "@mui/material/TableHead/TableHead";
import { Column } from "../../types/Column";

interface TableHeaderProps {
  columns: Column[];
}

function TableHeader({ columns }: TableHeaderProps) {
  return (
    <TableHead>
      {columns.map((column) => (
        <TableCell
          key={column.id}
          align={column.align}
          style={{ minWidth: column.minWidth }}
        >
          {column.label}
        </TableCell>
      ))}
    </TableHead>
  );
}

export default TableHeader;
