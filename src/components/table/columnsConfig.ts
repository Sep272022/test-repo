import { GridColDef } from "@mui/x-data-grid/models/colDef/gridColDef";

const columns: GridColDef[] = [
  { field: "name", headerName: "Donor's Name", width: 170 },
  { field: "type", headerName: "Donation Type", width: 200 },
  { field: "quantity", headerName: "Quantity", width: 150 },
  { field: "date", headerName: "Date", width: 100 },
];

export default columns;
