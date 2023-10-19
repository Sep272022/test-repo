import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormControl,
  MenuItem,
  TextField,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
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
    if (!quantity) {
      setError("Quantity is required");
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
        {error && <Alert severity="error">{error}</Alert>}
        <div>
          <FormControl>
            <TextField
              label="Name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              sx={{ m: 1, width: "25ch" }}
            />
            <TextField
              select
              label="Type"
              value={selectedDonationType ?? ""}
              sx={{ m: 1, width: "25ch" }}
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
              label="Quantity"
              type="number"
              value={quantity}
              onChange={(event) => setQuantity(Number(event.target.value))}
              sx={{ m: 1, width: "25ch" }}
            />
            <DatePicker
              label="Date"
              value={date}
              onChange={(newValue) => setDate(newValue)}
              sx={{ m: 1, width: "25ch" }}
            />
          </FormControl>
        </div>
      </Box>
      <Button id="submit-button" variant="contained" onClick={handleSubmit}>
        {loading ? <CircularProgress color="inherit" /> : "Submit"}
      </Button>
    </LocalizationProvider>
  );
}

export default Registration;
