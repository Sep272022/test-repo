import ThemeProvider from "@mui/material/styles/ThemeProvider";
import createTheme from "@mui/material/styles/createTheme";
import "./App.css";
import Registration from "./components/registration/Registration";
import Donation from "./types/Donation";
import { saveDonation } from "./utils/api";

function App() {
  const darkTheme = createTheme({
    palette: {
      mode: "dark",
    },
  });

  const submit = async (donation: Donation) => {
    const response = await saveDonation(donation);
    console.log(response);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Registration onSubmit={submit} />
    </ThemeProvider>
  );
}

export default App;
