import Donation from "../types/Donation";

// const mock_donation: Donation[] = MOCK_DONATION;
// const mock_distribution = MOCK_DISTRIBUTION;
// const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const baseURL = "http://localhost:3001";

export const saveDonation = async (donation: Donation) => {
  const response = await fetch(`${baseURL}/donate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(donation),
  });
  return response.json();
};

export const getAllDonations = async () => {
  const response = await fetch(`${baseURL}/donations`);
  const data = await response.json();
  console.log("data", data);
  return data;
};
