import MenuIcon from "@mui/icons-material/Menu";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import {
  AppBar,
  Box,
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

interface Ipages {
  name: string;
  component: JSX.Element;
}

const pages: Ipages[] = [
  { name: "Registration", component: <Registration /> },
  { name: "Distribution", component: <Distribution /> },
  { name: "Reports", component: <Reports /> },
];

function MenuComponent({
  onClick,
}: {
  onClick: (event: React.MouseEvent<HTMLElement>) => void;
}) {
  return pages.map((page) => (
    <MenuItem key={page.name} onClick={onClick}>
      <Typography textAlign="center">{page.name}</Typography>
    </MenuItem>
  ));
}

function NavigationBar({
  onClickPage,
}: {
  onClickPage: (page: string) => void;
}) {
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handlePageMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    const page = event.currentTarget.textContent;
    if (page) {
      onClickPage(page);
    }
    handleCloseNavMenu();
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };
  return (
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
              aria-label="Open navigation menu"
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
              <MenuComponent onClick={handlePageMenuClick} />
            </Menu>
          </Box>
          <Box sx={{ flexGrow: 1, display: { xs: "none", sm: "flex" } }}>
            <MenuComponent onClick={handlePageMenuClick} />
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

function PageContent({ currentPage }: { currentPage: Ipages }) {
  return (
    <Container maxWidth="xl">
      <Box sx={{ my: 2 }}>{currentPage.component}</Box>
    </Container>
  );
}

function App() {
  const [currentPage, setCurrentPage] = useState<Ipages>(pages[0]);
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

  const onClickPage = (page: string) => {
    setCurrentPage(pages.find((p) => p.name === page) || pages[0]);
  };

  return (
    <ThemeProvider theme={theme}>
      <NavigationBar onClickPage={onClickPage} />
      <PageContent currentPage={currentPage} />
    </ThemeProvider>
  );
}

export default App;
