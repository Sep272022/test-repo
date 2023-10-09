import { Tab, Tabs, useMediaQuery } from "@mui/material";
import Box from "@mui/material/Box/Box";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import createTheme from "@mui/material/styles/createTheme";
import { useMemo, useState } from "react";
import "./App.css";
import Distribution from "./components/distribution/Distribution";
import Registration from "./components/registration/Registration";
import Reports from "./components/reports/Reports";

function App() {
  const [value, setValue] = useState<number>(0);

  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? "dark" : "light",
        },
      }),
    [prefersDarkMode]
  );

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ width: "100%", height: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={value} onChange={handleChange}>
            <Tab label="Registration" />
            <Tab label="Distribution" />
            <Tab label="Reports" />
          </Tabs>
        </Box>
        <Box sx={{ p: 3 }}>
          {value === 0 && <Registration />}
          {value === 1 && <Distribution />}
          {value === 2 && <Reports />}
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
