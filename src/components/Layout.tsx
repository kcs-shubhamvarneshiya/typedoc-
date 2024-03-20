import { useState, useEffect } from "react";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Container from "@mui/material/Container";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import Sidebar from "./Sidebar";
import NotificationsIcon from "@mui/icons-material/Notifications";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import { AppBar, Button, Link } from "@mui/material";
import SessionService from "../services/SessionService";
import { User } from "../models/User";
import { CSSDefaults } from "../models/GlobalConstants";

/**
 * This class definition defines a TypeScript type Props with an optional property children that can hold React nodes.
 * `children?:` `React.ReactNode:` Defines a property `children` that can hold React nodes and is optional.
 */
type Props = {
  children?: React.ReactNode;
};

const defaultTheme = createTheme({
  palette: {
    primary: {
      main: CSSDefaults.primaryColor,
    },
    secondary: {
      main: CSSDefaults.primaryColor,
    },
  },
  typography: {
    h6: { fontSize: "1rem" },
    allVariants: {
      color: "#000",
    },
  },
});

const drawerWidth: number = 240;

/**
 * Renders a copyright notice with a link to Visual Comfort and the current year.
 *
 * @param {any} props - The properties to be spread to the Typography component.
 * @return {JSX.Element} The copyright notice JSX element.
 */
function Copyright(props: any) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://www.visualcomfort.com/">
        Visual Comfort
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

/**
 * Component for the page layout with sidebar and header.
 * @param {Props} children - The content to be displayed within the layout.
 * @return {ReactNode} The JSX for the page layout.
 */
export const PageLayout: React.FC<Props> = ({ children }) => {
  const [open, setOpen] = useState(true);
  const [user, setUser] = useState<User>();
  const [breadCrumbText, setBreadCrumbText] = useState("");

  const sessionService = SessionService.getInstance();

  /**
   * Function to toggle the drawer open/closed.
   */
  const toggleDrawer = () => {
    setOpen(!open);
  };

  /**
   * A function that logs out the user by clearing the session and redirecting to the home page.
   * @param {} - No parameters
   * @return {} - No return value
   */
  const logout = () => {
    sessionService.clearSession();
    window.location.replace("/");
  };

  useEffect(() => {
    const user = sessionService.getCurrentUser();
    setUser(user);
  }, []);

  /**
   * A function that updates the breadcrumb text based on the active parent and sub menus.
   *
   * @param {type} activeParentMenu - the active parent menu object
   * @param {type} activeSubMenu - the active sub menu object (optional)
   * @return {void}
   */
  const onActiveMenuChange = (activeParentMenu, activeSubMenu) => {
    setBreadCrumbText(
      `${activeParentMenu.title}${
        activeSubMenu ? " > " + activeSubMenu.title : ""
      }`
    );
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              px: [1],
            }}
          >
            <div style={{ width: "265px" }}>
              <Link href="/">
                <img
                  src="/logo.png"
                  alt="Visual Comfort"
                  className="img-fluid"
                  style={{ width: "100%" }}
                />
              </Link>
              <h6>Product Development Tool</h6>
            </div>
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List component="nav" style={{ width: "250px" }}>
            <Sidebar onActiveMenuChange={onActiveMenuChange} />
          </List>
        </Drawer>
        <div style={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
          <AppBar
            position="sticky"
            style={{
              background: CSSDefaults.headerBgColor,
              color: CSSDefaults.headerFontColor,
              display: "block",
            }}
          >
            <Toolbar
              sx={{
                pr: "15px", // keep right padding when drawer closed
              }}
            >
              <IconButton
                edge="start"
                color="inherit"
                aria-label="open drawer"
                onClick={toggleDrawer}
                sx={{
                  marginRight: "36px",
                  ...(open && { display: "none" }),
                }}
              >
                <MenuIcon />
              </IconButton>
              <Typography
                component="h1"
                variant="h6"
                noWrap
                sx={{ flexGrow: 1 }}
              >
                {breadCrumbText}
              </Typography>
              <IconButton title="Notifications">
                <Badge badgeContent={4} color="primary">
                  <NotificationsIcon sx={{ color: "#484848" }} />
                </Badge>
              </IconButton>
              <IconButton title="Logout" onClick={logout}>
                <LogoutOutlinedIcon sx={{ color: "#484848", mr: 2 }} />
              </IconButton>

              <Typography component="h6" variant="h6" textAlign="right" noWrap>
                {user?.name} <br />
                {user?.email}
              </Typography>
            </Toolbar>
          </AppBar>
          <Box
            component="main"
            sx={{
              backgroundColor: (theme) =>
                theme.palette.mode === "light"
                  ? theme.palette.grey[100]
                  : theme.palette.grey[900],
              flexGrow: 1,
              height: "100vh",
              overflow: "auto",
            }}
          >
            <Container maxWidth="xl" sx={{ mt: 2, mb: 2 }}>
              {children}
              <Copyright sx={{ pt: 4 }} />
            </Container>
          </Box>
        </div>
      </Box>
    </ThemeProvider>
  );
};
