// import "@testing-library/jest-dom/matchers";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { saveDonation } from "../../utils/apiClient";
// FIXME: Error: SyntaxError: Cannot use import statement outside a module at node_modules\@mui\x-date-pickers\DatePicker\DatePicker.js:1
import Registration from "./Registration";

jest.mock("../../utils/apiClient", () => {
  return {
    saveDonation: jest.fn(),
  };
});

const fillField = (label: string, value: string) => {
  fireEvent.change(screen.getByLabelText(label), {
    target: { value: value },
  });
};

const selectItem = async (label: string, value: string) => {
  fireEvent.mouseDown(screen.getByLabelText(label));
  const listItem = await screen.findByText(value);
  fireEvent.click(listItem);
};

const clickSubmitAndCheckError = async (
  submitText: string,
  errorText: string
) => {
  fireEvent.click(screen.getByText(submitText));
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

    fillField("Name", "John Doe");
    await clickSubmitAndCheckError("Submit", "Type is required");

    await selectItem("Type", "Food");
    await clickSubmitAndCheckError("Submit", "Quantity is required");

    fillField("Quantity", "5");
    await clickSubmitAndCheckError("Submit", "Date is required");
  });

  it("submits the form correctly with valid data", async () => {
    const mockedSaveDonation = saveDonation as jest.MockedFunction<
      typeof saveDonation
    >;

    mockedSaveDonation.mockResolvedValueOnce(undefined);

    render(<Registration />);

    fillField("Name", "John Doe");
    await selectItem("Type", "Food");
    fillField("Quantity", "5");
    fillField("Date", "2021-04-01");

    await act(async () => {
      fireEvent.click(screen.getByText("Submit"));
    });

    await waitFor(() => {
      expect(saveDonation).toHaveBeenCalledTimes(1);
    });

    expect(mockedSaveDonation).toHaveBeenCalledWith({
      name: "John Doe",
      type: "Food",
      quantity: 5,
      date: "2021-04-01",
    });
  });
});
