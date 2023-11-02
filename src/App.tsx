import MenuIcon from "@mui/icons-material/Menu";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  useMediaQuery,
} from "@mui/material";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import createTheme from "@mui/material/styles/createTheme";
import { useMemo, useState } from "react";
import "./App.css";
import Distribution from "./components/distribution/Distribution";
import Registration from "./components/registration/Registration";
import Reports from "./components/reports/Reports";

const pages = ["Registration", "Distribution", "Reports"];

function App() {
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);

  const [currentPage, setCurrentPage] = useState<String>(pages[0]);

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

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handlePageMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    const page = event.currentTarget.textContent;
    if (page) {
      setCurrentPage(page);
    }
    handleCloseNavMenu();
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 2,
                display: { xs: "none", sm: "flex" },
                fontWeight: 700,
                color: "inherit",
                textDecoration: "none",
              }}
            >
              <VolunteerActivismIcon sx={{ mr: 1 }} />
              Donation Management System
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: "flex", sm: "none" } }}>
              <IconButton
                size="large"
                aria-label="menu"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: "block", sm: "none" },
                }}
              >
                {pages.map((page) => (
                  <MenuItem key={page} onClick={handlePageMenuClick}>
                    <Typography textAlign="center">{page}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
            <Box sx={{ flexGrow: 1, display: { xs: "none", sm: "flex" } }}>
              {pages.map((page) => (
                <Button
                  key={page}
                  onClick={handlePageMenuClick}
                  sx={{ my: 2, color: "white", display: "block" }}
                >
                  {page}
                </Button>
              ))}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <Container maxWidth="xl">
        <Box sx={{ my: 2 }}>
          {currentPage === "Registration" && <Registration />}
          {currentPage === "Distribution" && <Distribution />}
          {currentPage === "Reports" && <Reports />}
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
