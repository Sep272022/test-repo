import "@testing-library/jest-dom/";
import { act, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { saveDonation } from "../../utils/apiClient";
import Registration from "./Registration";

jest.mock("../../utils/apiClient", () => ({
  saveDonation: jest.fn(),
}));

const fillField = async (label: string, value: string) => {
  const input = screen.getByLabelText(label);
  await act(async () => {
    await userEvent.type(input, value);
  });
};

const selectItem = async (label: string, value: string) => {
  await userEvent.click(screen.getByLabelText(label));
  const listItem = await screen.findByText(value);
  await userEvent.click(listItem);
};

const clickSubmitAndCheckError = async (errorText: string) => {
  await userEvent.click(screen.getByText("Submit"));
  const errorMessage = await screen.findByText(errorText);
  expect(errorMessage).toBeInTheDocument();
};

describe("Registration", () => {
  it("renders correctly", () => {
    const { getByText } = render(<Registration />);
    expect(getByText("Submit")).toBeInTheDocument();
  });

  it("displays an error message when trying to submit an empty form", async () => {
    render(<Registration />);

    await clickSubmitAndCheckError("Name is required");

    await fillField("Name", "John Doe");
    await clickSubmitAndCheckError("Type is required");

    await selectItem("Type", "Food");
    await clickSubmitAndCheckError("Quantity is required");

    await fillField("Quantity", "5");
    await clickSubmitAndCheckError("Date is required");
  });

  it("submits the form correctly with valid data", (done) => {
    const mockedSaveDonation = saveDonation as jest.MockedFunction<
      typeof saveDonation
    >;

    mockedSaveDonation.mockResolvedValueOnce(undefined);

    render(<Registration />);

    fillField("Name", "John Doe");
    selectItem("Type", "Food");
    fillField("Quantity", "5");
    fillField("Date", "04012021");

    act(async () => {
      await userEvent.click(screen.getByText("Submit"));
    }).then(() => {
      expect(saveDonation).toHaveBeenCalledTimes(1);
      expect(mockedSaveDonation).toHaveBeenCalledWith({
        name: "John Doe",
        type: "Food",
        quantity: 5,
        date: "2021-04-01",
      });
    });

    done();
  });
});
