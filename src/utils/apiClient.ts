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

async function handleResponse(response: Response) {
  if (!response.ok) {
    throw Error(response.statusText);
  }
  const data = await response.json();
  console.log("data received", data);
  return data;
}

export const getAllDonations = async () => {
  const response = await fetch(`${baseURL}/donations`);
  return await handleResponse(response);
};

export const getAllDistributions = async () => {
  const response = await fetch(`${baseURL}/distributions`);
  return await handleResponse(response);
};

export const getDonationReport = async () => {
  const response = await fetch(`${baseURL}/reports/donations`);
  return await handleResponse(response);
};

export const getDonorReport = async () => {
  const response = await fetch(`${baseURL}/reports/donors`);
  return await handleResponse(response);
};
