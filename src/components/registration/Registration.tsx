import { Box, Button, FormControl, MenuItem, TextField } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider/LocalizationProvider";
import { Dayjs } from "dayjs";
import { useState } from "react";
import Donation from "../../types/Donation";

interface RegistrationProps {
  onSubmit: (donation: Donation) => void;
}

function Registration({ onSubmit }: RegistrationProps) {
  const [name, setName] = useState<string>("");
  const [selectedDonationType, setSelectedDonationType] =
    useState<string>("food");
  const [quantity, setQuantity] = useState<number>(0);
  const [date, setDate] = useState<Dayjs | null>(null);

  const donationTypes = ["food", "money", "clothing", "other"];

  function handleSubmit(): void {
    // TODO: validate

    const donation: Donation = {
      name,
      type: selectedDonationType,
      quantity,
      date: date?.format("YYYY-MM-DD") ?? "",
    };
    onSubmit(donation);
  }

  // TODO: add indicator for whether the donation was successfully submitted
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ display: "flex", p: 3, flexWrap: "wrap" }}>
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
              defaultValue={selectedDonationType}
              sx={{ m: 1, width: "25ch" }}
            >
              {donationTypes.map((type) => (
                <MenuItem
                  key={type}
                  value={type}
                  onSelect={() => setSelectedDonationType(type)}
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
      <Button variant="contained" onClick={handleSubmit}>
        Submit
      </Button>
    </LocalizationProvider>
  );
}

export default Registration;
