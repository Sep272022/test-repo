import { useEffect, useState } from "react";
import Donation from "../../types/Donation";
import { getAllDonations } from "../../utils/apiClient";

function ReportByType() {
  const [donations, setDonations] = useState<Donation[]>([]);

  useEffect(() => {
    getAllDonations().then((donations) => setDonations(donations));
  }, []);

  return (
    <div>
      <h1>Inventory Report: Donations by Type</h1>
      <h2>Report Title: Inventory Status of Donations</h2>
      <h2>Date: {new Date().toLocaleString()}</h2>
      <h2>Generated By: user</h2>

      <h2>Total Donations Received:</h2>
      <h2>Most Donated Type</h2>
    </div>
  );
}

export default ReportByType;
