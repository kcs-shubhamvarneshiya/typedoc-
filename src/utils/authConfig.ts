import { Configuration, PopupRequest } from "@azure/msal-browser";

// Config object to be passed to Msal on creation
export const msalConfig: Configuration = {
  auth: {
    clientId: process.env.REACT_APP_REACT_AD_CLIENT_ID || "",
    authority: process.env.REACT_APP_AD_AUTHORITY,
    redirectUri: process.env.REACT_APP_AD_REDIRECT_URI,
    postLogoutRedirectUri: process.env.REACT_APP_AD_REDIRECT_URI,
  },
};

// Add here scopes for id token to be used at MS Identity Platform endpoints.
export const loginRequest: PopupRequest = {
  scopes: [process.env.REACT_APP_AD_SCOPE || ""],
  redirectUri: `${process.env.REACT_APP_AD_REDIRECT_URI}`
};

// Add here the endpoints for MS Graph API services you would like to use.
export const graphConfig = {
  graphMeEndpoint: process.env.REACT_APP_AD_GRAPH_URI || "",
};
