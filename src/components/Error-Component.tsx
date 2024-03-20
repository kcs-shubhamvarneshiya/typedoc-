import { MsalAuthenticationResult } from "@azure/msal-react";
import { Box, Container, Typography } from "@mui/material";

/**
 * Renders an error component with the provided error message.
 *
 * @param {MsalAuthenticationResult} error - The error object to be displayed.
 * @return {ReactNode} The error component JSX element.
 */
export const ErrorComponent: React.FC<MsalAuthenticationResult> = ({
  error,
}) => {
  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{
        display: "flex",
        alignItems: "center",
        height: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          An Error Occurred: {JSON.stringify(error)}
        </Typography>
      </Box>
    </Container>
  );
};
