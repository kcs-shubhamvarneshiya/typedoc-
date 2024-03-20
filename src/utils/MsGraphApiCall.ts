import ApiService from "../services/ApiService";
import { ApiResponse } from "../models/ApiResponse";
import { SessionDetails } from "../models/SessionDetails";
import { msalInstance } from "../index";
import { loginRequest } from "./authConfig";

/**
 * Handles the AAD login response by getting the active account, acquiring a token silently, and logging the response.
 * @return {Promise<void>} A Promise that resolves when the response is logged.
 */
export async function handleAADLoginResponse() {
  const account = msalInstance.getActiveAccount();
  if (!account) {
    throw Error();
  }

  const response = await msalInstance.acquireTokenSilent({
    ...loginRequest,
    account: account,
  });
  
  console.log(response);
  
}

/**
 * This code snippet is a function that takes a JWT (JSON Web Token) as input, 
 * extracts the payload from it, decodes the payload from base64, and returns it as a JSON object.
 *
 * @param {string} token - The JWT token to be parsed.
 * @return {object} The decoded JSON payload from the JWT token.
 * 
 */
function parseJwt(token: string) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}
