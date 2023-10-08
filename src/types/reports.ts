export interface DontationReport {
  donationType: string;
  totalReceived: number;
  totalDistributed: number;
  availableAmount: number;
}

export interface DonorReport {
  donorName: string;
  foodDonated: number;
  moneyDonated: number;
  clothingDonated: number;
  otherDonated: number;
}
