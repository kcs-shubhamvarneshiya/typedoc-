import { Snackbar, Alert, AlertColor } from "@mui/material";
import Stack from "@mui/material/Stack";
import { useEffect, useState } from "react";
import { ToastTypeProps } from "../utils/types";

/**
 * This code defines a Toast component in TypeScript and React. 
 * It uses the useState and useEffect hooks to manage the component's state and side effects. 
 * The component renders a Snackbar with an Alert, 
 * and it provides a handleClose function to handle the close event.
 *
 * @param {React.SyntheticEvent | Event} event - optional event parameter
 * @param {string} reason - optional reason parameter
 * @return {void} 
 */
export default function Toast(props: ToastTypeProps) {
  let { open, message, type } = props;
  const [openToast, setOpenToast] = useState(Boolean);


  /**
   * A function to handle the close event.
   *
   * @param {React.SyntheticEvent | Event} event - optional event parameter
   * @param {string} reason - optional reason parameter
   * @return {void} 
   */
  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenToast(false);
  };
  useEffect(() => {
    if (open !== 0 && message !== "") setOpenToast(true);
  }, [open, message]);
  return (
    <Stack spacing={2} sx={{ width: "100%" }}>
      <Snackbar
        open={openToast}
        onClose={handleClose}
        autoHideDuration={7000}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        <Alert
          onClose={() => setOpenToast(false)}
          severity={type as AlertColor}
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>
    </Stack>
  );
}
