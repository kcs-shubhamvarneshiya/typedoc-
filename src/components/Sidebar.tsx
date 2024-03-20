import { useState, useEffect } from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { Collapse, Divider, List, makeStyles } from "@mui/material";
import { CSSDefaults, sidebarMenuItems } from "../models/GlobalConstants";
import * as Icons from "@mui/icons-material"; // Import all icons from MUI
import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";
import { NavLink, useLocation } from "react-router-dom";
import {SideBarProps} from "../utils/types";

/**
 * This code defines a sidebar component for a web application, which renders a list of menu items with submenus.
 * It uses state to manage the open menu and the current page menu. 
 * It also includes a function to dynamically retrieve icon components and uses the React Router for navigation. 
 * The component also uses Material-UI components for rendering the sidebar items and submenus.
 *
 * @param {SideBarProps} props - the props for the sidebar
 * @return {JSX.Element} the rendered sidebar component
 */
export default function Sidebar(props: SideBarProps) {
  const smallerWidthIconStyle = { minWidth: "unset", marginRight: 2 };
  const [openMenu, setOpenMenu] = useState("");
  const [currentPageMenu, setCurrentPageMenu] = useState("");
  const location = useLocation();

  /**
   * A function that retrieves the icon component based on the provided icon name.
   *
   * @param {string} iconName - The name of the icon to retrieve
   * @return {JSX.Element} The icon component if found, or null
   */
  const getIconComponent = (iconName) => {
    const IconComponent = Icons[iconName]; // Get the icon dynamically using bracket notation
    return IconComponent ? <IconComponent /> : null; // Return the icon component if found
  };

  useEffect(() => {
    const activeParentMenu = sidebarMenuItems.find(
      (m) =>
        m.path === location.pathname ||
        m.subMenus?.some((sm) => sm.path === location.pathname)
    );

    if (activeParentMenu) {
      setCurrentPageMenu(activeParentMenu.title);
      setOpenMenu(activeParentMenu.title);
      props.onActiveMenuChange(
        activeParentMenu,
        activeParentMenu.subMenus?.find((sm) => sm.path === location.pathname)
      );
    }
  }, [location]);

  return (
    <>
      {sidebarMenuItems.map((menu) => (
        <div key={menu.title}>
          <ListItemButton
            selected={currentPageMenu === menu.title}
            onClick={() => setOpenMenu(menu.title)}
            sx={{
              "&.Mui-selected": {
                backgroundColor: CSSDefaults.sideBarActiveMenuBg,
              },
              "&.Mui-focusVisible": {
                backgroundColor: CSSDefaults.sideBarFocusMenuBg,
              },
              ":hover": {
                backgroundColor: CSSDefaults.sideBarFocusMenuBg,
              },
            }}
          >
            <ListItemIcon sx={smallerWidthIconStyle}>
              {getIconComponent(menu.icon)}
            </ListItemIcon>
            {menu.subMenus?.length ? (
              <ListItemText primary={menu.title} />
            ) : (
              <NavLink to={menu.path as string}>
                <ListItemText primary={menu.title} />
              </NavLink>
            )}
            {menu.subMenus?.length && <ChevronRightOutlinedIcon />}
          </ListItemButton>
          {menu.subMenus && (
            <Collapse in={openMenu === menu.title} timeout="auto" unmountOnExit>
              {menu.subMenus.map((subMenu) => (
                <List
                  key={subMenu.title}
                  className="sub-menu-list"
                  component="div"
                  sx={{ pl: 3 }}
                  disablePadding
                >
                  <ListItemButton>
                    <ListItemIcon sx={smallerWidthIconStyle}>
                      &rarr;
                    </ListItemIcon>
                    <NavLink to={subMenu.path}>{subMenu.title}</NavLink>
                  </ListItemButton>
                </List>
              ))}
            </Collapse>
          )}
          <Divider />
        </div>
      ))}
    </>
  );
}
