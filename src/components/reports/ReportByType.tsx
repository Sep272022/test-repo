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

function ReportByType() {
  const [donations, setDonations] = useState<Donation[]>([]);

  useEffect(() => {
    getAllDonations().then((donations) => setDonations(donations));
  }, []);

  return (
    <div>
      <h1>Report by type</h1>
    </div>
  );
}

export default ReportByType;
