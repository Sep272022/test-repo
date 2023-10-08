import { GridColDef } from "@mui/x-data-grid/models/colDef/gridColDef";

export const columns: GridColDef[] = [
  { field: "type", headerName: "Donation Type", width: 200 },
  { field: "quantity", headerName: "Quantity", width: 150 },
  { field: "date", headerName: "Date", width: 100 },
];

export const columnForDonationReport: GridColDef[] = [
  { field: "donationType", headerName: "Donation Type", width: 200 },
  { field: "totalReceived", headerName: "Total Received	", width: 200 },
  { field: "totalDistributed", headerName: "Total Distributed", width: 200 },
  { field: "availableAmount", headerName: "Available Amount", width: 200 },
];

export const columnForDonorReport: GridColDef[] = [
  { field: "donorName", headerName: "Donor's Name", width: 150 },
  { field: "foodDonated", headerName: "Food Donated", width: 150 },
  { field: "moneyDonated", headerName: "Money Donated", width: 150 },
  { field: "clothingDonated", headerName: "Clothing Donated", width: 150 },
  { field: "otherDonated", headerName: "Other Donated", width: 150 },
];
