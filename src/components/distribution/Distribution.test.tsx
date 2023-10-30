import "@testing-library/jest-dom";
import { act, render, screen, waitFor } from "@testing-library/react";
import { getAllDistributions } from "../../utils/apiClient";
import Distribution from "./Distribution";

jest.mock("../../utils/apiClient", () => ({
  getAllDistributions: jest.fn(),
}));

const dummyDistributions = [
  { id: 1, type: "Food", quantity: 9, date: "2022-10-10" },
  { id: 2, type: "Clothing", quantity: 4, date: "2022-10-11" },
  { id: 3, type: "Money", quantity: 499, date: "2022-10-12" },
  { id: 4, type: "Other", quantity: 51, date: "2022-10-13" },
];

describe("<Distribution />", () => {
  test("fetches and displays the distributions", async () => {
    (getAllDistributions as jest.Mock).mockResolvedValue(dummyDistributions);

    await act(async () => {
      render(<Distribution />);
    });

    await waitFor(() => {
      expect(getAllDistributions).toHaveBeenCalledTimes(1);
    });

    checkDistribution("Food", "9", "2022-10-10");
    checkDistribution("Clothing", "4", "2022-10-11");
    checkDistribution("Money", "499", "2022-10-12");
    checkDistribution("Other", "51", "2022-10-13");
  });
});

const checkDistribution = (type: string, quantity: string, date: string) => {
  expect(screen.getByText(type)).toBeInTheDocument();
  expect(screen.getByText(quantity)).toBeInTheDocument();
  expect(screen.getByText(date)).toBeInTheDocument();
};
