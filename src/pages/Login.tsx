import {
  Box,
  Button,
  CssBaseline,
  Grid,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { loginRequest } from "../utils/authConfig";
import { useMsal } from "@azure/msal-react";
import { useState } from "react";
import { EmailOutlined } from "@mui/icons-material";
import api from "../services/ApiService";
import { toast } from "react-toastify";
import { ApiResponse } from "../models/ApiResponse";

export default function Login() {
  const { instance } = useMsal();
  const [emailId, setEmailId] = useState("");

  const handleLogin = async () => {
    if (!emailId) {
      toast.error("Please enter email to login");
    } else {
      try {
        const resp = await api.get<ApiResponse<boolean>>(
          `/user/can-login/${emailId}`
        );
        if (resp.data === true) {
          const adLoginUrl = process.env.REACT_APP_AD_AUTHORITY;
          const clientId = process.env.REACT_APP_REACT_AD_CLIENT_ID;
          const redirectUri = encodeURIComponent(
            process.env.REACT_APP_AD_REDIRECT_URI as string
          ); // Redirect URI after login
          const responseType = "token";
          const responseMode = "fragment"; // To receive tokens directly in the query string
          const scope = encodeURIComponent(
            process.env.REACT_APP_AD_SCOPE as string
          ); // Add scopes as needed
          const state = Math.random().toString(); // Include state to prevent CSRF attacks

          window.sessionStorage.setItem("aad-login-state", state);

          const loginUrl =
            `${adLoginUrl}/oauth2/v2.0/authorize?` +
            `client_id=${clientId}&` +
            `response_type=${responseType}&` +
            `redirect_uri=${redirectUri}&` +
            `response_mode=${responseMode}&` +
            `scope=openid+${scope}&login_hint=${emailId}&` +
            `nonce=${state}`;

          window.location.replace(loginUrl);
        } else {
          toast.error(
            resp.message || `User ${emailId} is not allowed for login`
          );
        }
      } catch (error) {
        console.log(error);
      }
      // first check if user exists for given email
    }
  };

  return (
    <>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={6}
          md={6}
          sx={{
            backgroundImage: "url(/loginsso.png)",
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Grid
          display={"flex"}
          item
          xs={12}
          sm={6}
          md={6}
          component={Paper}
          elevation={6}
          square
        >
          <Box
            width={"100%"}
            margin={"auto !important"}
            paddingLeft={4}
            paddingRight={4}
          >
            <img
              src="/logo.png"
              alt="Visual Comfort"
              loading="lazy"
              height={22}
              width={263}
            />
            <Typography
              align="left"
              fontSize={16}
              paddingBottom={5}
              component="p"
            >
              Product Development Tool
            </Typography>
            <Typography fontSize={36} component="h1" variant="h5">
              Sign in with <strong>SSO</strong>
            </Typography>
            <Box sx={{ mt: 5 }}>
              <TextField
                label="Enter Email"
                variant="outlined"
                InputProps={{
                  style: {
                    width: "500px",
                    height: "35px",
                  },
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailOutlined />
                    </InputAdornment>
                  ),
                }}
                onChange={(event) => setEmailId(event.target.value)}
                required
              />
              <Button
                onClick={handleLogin}
                type="submit"
                id="signIn"
                fullWidth
                style={{
                  maxWidth: "500px",
                }}
                variant="contained"
                sx={{ mt: 2, mb: 2 }}
              >
                SIGN IN WITH YOUR EMAIL ID
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </>
  );
}
