import { Tab, Tabs } from "@mui/material";
import Box from "@mui/material/Box/Box";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import createTheme from "@mui/material/styles/createTheme";
import { useState } from "react";
import "./App.css";
import Distribution from "./components/distribution/Distribution";
import Registration from "./components/registration/Registration";
import Reports from "./components/reports/Reports";
import Donation from "./types/Donation";
import { saveDonation } from "./utils/api";

function App() {
  const [value, setValue] = useState<number>(0);

  const darkTheme = createTheme({
    palette: {
      mode: "dark",
    },
  });

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const submit = async (donation: Donation) => {
    const response = await saveDonation(donation);
    console.log(response);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ width: "100%", height: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={value} onChange={handleChange}>
            <Tab label="Registration" />
            <Tab label="Distribution" />
            <Tab label="Reports" />
          </Tabs>
        </Box>
        <Box sx={{ p: 3 }}>
          {value === 0 && <Registration onSubmit={submit} />}
          {value === 1 && <Distribution />}
          {value === 2 && <Reports />}
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
