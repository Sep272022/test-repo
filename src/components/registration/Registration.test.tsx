import "@testing-library/jest-dom/matchers";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { saveDonation } from "../../utils/apiClient";
import Registration from "./Registration";

// Mocking the saveDonation function since we don't actually want to call the API during tests
jest.mock("../../utils/apiClient", () => {
  return {
    saveDonation: jest.fn(),
  };
});

describe("Registration", () => {
  it("renders correctly", () => {
    const { getByText } = render(<Registration />);
    expect(getByText("Submit")).toBeInTheDocument();
  });

  it("displays an error message when trying to submit an empty form", async () => {
    const { getByText, findByText } = render(<Registration />);

    fireEvent.click(getByText("Submit"));

    const errorMessage = await findByText("Name is required");
    expect(errorMessage).toBeInTheDocument();
  });

  it("submits the form correctly with valid data", async () => {
    const mockedSaveDonation = saveDonation as jest.MockedFunction<
      typeof saveDonation
    >;

    mockedSaveDonation.mockResolvedValueOnce(undefined);

    render(<Registration />);

    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "John Doe" },
    });
    fireEvent.mouseDown(screen.getByLabelText("Type"));
    const listItem = await screen.findByText("Food");
    fireEvent.click(listItem);
    fireEvent.change(screen.getByLabelText("Quantity"), {
      target: { value: "5" },
    });
    // Further interactions can be added for the DatePicker if necessary, but for brevity, I'm focusing on other inputs

    await act(async () => {
      fireEvent.click(screen.getByText("Submit"));
    });

    await waitFor(() => {
      expect(saveDonation).toHaveBeenCalledTimes(1);
    });
  });

  // ... More tests can be added for other interactions and scenarios ...
});
