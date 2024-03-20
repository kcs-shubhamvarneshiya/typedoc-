import { USER_ROLES } from "../utils/constants";
import jwt_decode, { jwtDecode } from "jwt-decode";

/**
 * Function to validate access based on user permissions.
 *
 * @param {string} menu - the menu item to check access for
 * @return {boolean} indicates if the menu item is accessible
 */
export const accessValidate = (menu: string) => {
  const userData = localStorage.getItem("puser") || "";
  if (userData) {
    const user = JSON.parse(userData);
    const access = user?.permissions?.split(",");
    if (access?.length > 0) {
      return access.includes(menu);
    }
  }
  return true;
};

/**
 * Generates the current user's role based on the session data stored in local storage.
 *
 * @return {string[]} The current user's role(s) or the default user role if no roles are found.
 */
export const currentUserRole = () => {
  let roles: string[] = [];
  const userData = localStorage.getItem("session");
  if (userData) {
    const user = JSON.parse(userData);
    const payload: any = jwtDecode(user?.accessToken);
    roles = payload?.roles;
  }
  return roles && roles.length ? roles : [USER_ROLES.USER];
};
