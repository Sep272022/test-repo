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
  await userEvent.type(input, value);
};

const selectItem = async (label: string, value: string) => {
  await userEvent.click(screen.getByLabelText(label));
  const listItem = await screen.findByText(value);
  await userEvent.click(listItem);
};

const clickSubmitAndCheckError = async (
  submitText: string,
  errorText: string
) => {
  await userEvent.click(screen.getByText(submitText));
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

    await clickSubmitAndCheckError("Submit", "Name is required");

    await fillField("Name", "John Doe");
    await clickSubmitAndCheckError("Submit", "Type is required");

    await selectItem("Type", "Food");
    await clickSubmitAndCheckError("Submit", "Quantity is required");

    await fillField("Quantity", "5");
    await clickSubmitAndCheckError("Submit", "Date is required");
  });

  it("submits the form correctly with valid data", async () => {
    const mockedSaveDonation = saveDonation as jest.MockedFunction<
      typeof saveDonation
    >;

    mockedSaveDonation.mockResolvedValueOnce(undefined);

    render(<Registration />);

    await fillField("Name", "John Doe");
    await selectItem("Type", "Food");
    await fillField("Quantity", "5");
    await fillField("Date", "04012021");

    await act(async () => {
      userEvent.click(screen.getByText("Submit")).then(() => {
        expect(saveDonation).toHaveBeenCalledTimes(1);
        expect(mockedSaveDonation).toHaveBeenCalledWith({
          name: "John Doe",
          type: "Food",
          quantity: 5,
          date: "2021-04-01",
        });
      });
    });
  });
});
