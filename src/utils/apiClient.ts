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

export const getAllDistributions = async () => {
  const response = await fetch(`${baseURL}/distributions`);
  const data = await response.json();
  console.log("data", data);
  return data;
};

export const getDonationReport = async () => {
  const response = await fetch(`${baseURL}/reports/donations`);
  const data = await response.json();
  console.log("data", data);
  return data;
};

export const getDonorReport = async () => {
  const response = await fetch(`${baseURL}/reports/donors`);
  const data = await response.json();
  console.log("data", data);
  return data;
};
