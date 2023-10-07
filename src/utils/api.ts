import Donation from "../types/Donation";
import MOCK_DATA from "./donations.json";

const mock_donation: Donation[] = MOCK_DATA;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const saveDonation = async (donation: Donation) => {
  await delay(1000);
  mock_donation.push(donation);
  return Promise.resolve(donation);
};

export const loadDonations = async () => {
  await delay(1000);
  return Promise.resolve(mock_donation);
};
