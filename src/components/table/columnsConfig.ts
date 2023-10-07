import { Column } from "../../types/Column";

const columns: Column[] = [
  { id: "name", label: "Donor's Name", minWidth: 170 },
  { id: "type", label: "Donation Type", minWidth: 100 },
  { id: "quantity", label: "Quantity", minWidth: 100 },
  { id: "date", label: "Date", minWidth: 100 },
];

export default columns;
