import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormControl,
  MenuItem,
  TextField,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider/LocalizationProvider";
import { Dayjs } from "dayjs";
import { useState } from "react";
import Donation from "../../types/Donation";
import { DonationTypes } from "../../types/DonationTypes";
import { saveDonation } from "../../utils/apiClient";

function Registration() {
  const [name, setName] = useState<string>("");
  const [selectedDonationType, setSelectedDonationType] =
    useState<DonationTypes | null>(null);
  const [quantity, setQuantity] = useState<number>(0);
  const [date, setDate] = useState<Dayjs | null>(null);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const donationTypes = ["Food", "Clothing", "Money", "Other"];

  function handleSubmit() {
    if (!validate()) {
      return;
    }
    setError("");
    setLoading(true);
    const submitButton = document.getElementById(
      "submit-button"
    ) as HTMLButtonElement;
    submitButton.disabled = true;

    const donation: Donation = {
      name,
      type: selectedDonationType!,
      quantity,
      date: date!.format("YYYY-MM-DD"),
    };
    saveDonation(donation)
      .then(() => {
        setName("");
        setSelectedDonationType("Food");
        setQuantity(0);
        setDate(null);
        setLoading(false);
        setError("");
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      })
      .finally(() => {
        submitButton.disabled = false;
      });
  }

  // If the quantity input is 0, clear the input when the user clicks on it.
  const handleQuantityClick = () => {
    const quantityInput = document.getElementById(
      "quantity-input"
    ) as HTMLInputElement | null;
    if (quantityInput && quantityInput.value === "0") {
      quantityInput.value = "";
    }
  };

  // When the user hovers over the type input, open the dropdown.
  // FIXME: It doesn't work on mobile.
  const handleMouseEnter = () => {
    const selectElement = document.getElementById("type-input");
    if (selectElement) {
      const mouseEvent = new MouseEvent("mousedown", {
        bubbles: true,
        cancelable: true,
        view: window,
      });
      selectElement.dispatchEvent(mouseEvent);
    }
  };

  /**
   * Validates the registration form fields.
   * @returns true if all fields are valid, otherwise false.
   */
  function validate() {
    if (!name) {
      setError("Name is required");
      return false;
    }
    if (!selectedDonationType) {
      setError("Type is required");
      return false;
    }
    if (!donationTypes.includes(selectedDonationType)) {
      setError("Type is invalid");
      return false;
    }
    if (!quantity) {
      setError("Quantity is required");
      return false;
    }
    if (quantity <= 0) {
      setError("Quantity must be greater than 0");
      return false;
    }
    if (!date) {
      setError("Date is required");
      return false;
    }
    return true;
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ p: 3 }}>
        <FormControl>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            label="Name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            sx={{ m: 1, width: "25ch" }}
          />
          <TextField
            select
            id="type-input"
            label="Type"
            value={selectedDonationType ?? ""}
            sx={{ m: 1, width: "25ch" }}
            InputProps={{
              onMouseEnter: handleMouseEnter,
            }}
          >
            {donationTypes.map((type) => (
              <MenuItem
                key={type}
                value={type}
                onClick={() => setSelectedDonationType(type as DonationTypes)}
              >
                {type}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            id="quantity-input"
            label="Quantity"
            type="number"
            value={quantity}
            onClick={handleQuantityClick}
            onChange={(event) => setQuantity(Number(event.target.value))}
            sx={{ m: 1, width: "25ch" }}
          />
          <div
            onMouseEnter={() => setIsDatePickerOpen(true)}
            onMouseLeave={() => setIsDatePickerOpen(false)}
          >
            <DesktopDatePicker
              label="Date"
              value={date}
              open={isDatePickerOpen}
              onChange={(newValue) => {
                setDate(newValue);
                setIsDatePickerOpen(false);
              }}
              sx={{ m: 1, width: "25ch" }}
            />
          </div>
        </FormControl>
      </Box>
      <Button id="submit-button" variant="contained" onClick={handleSubmit}>
        {loading ? <CircularProgress color="inherit" /> : "Submit"}
      </Button>
    </LocalizationProvider>
  );
}

export default Registration;
