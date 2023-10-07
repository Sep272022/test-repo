import Donation from "./Donation";

export interface Column {
  id: keyof Donation;
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: number) => string;
}
