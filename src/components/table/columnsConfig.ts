import { GridColDef } from "@mui/x-data-grid/models/colDef/gridColDef";

const columns: GridColDef[] = [
  { field: "name", headerName: "Donor's Name", minWidth: 170 },
  { field: "type", headerName: "Donation Type", minWidth: 100 },
  { field: "quantity", headerName: "Quantity", type: "number", minWidth: 100 },
  { field: "date", headerName: "Date", minWidth: 100 },
];

export default columns;
