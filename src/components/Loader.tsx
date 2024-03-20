import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

/**
 * Generates a loader component to display when isLoading is true.
 * This code defines a React functional component called Loader that generates a loader component to display when the isLoading prop is true.
 * The loader component is a box with a circular progress indicator in the center, positioned absolutely on top of the parent component.
 * The background of the box is semi-transparent white.
 *
 * @param {any} props - the properties passed to the loader component
 * @return {JSX.Element} the loader component
 * 
 */
const Loader = (props: any) => {
  return (
    <>
      {props.isLoading && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "absolute",
            top: 0,
            left: 0,
            height: "100%",
            width: "100%",
            background: "rgba(255, 255, 255, 0.5)",
            textAlign: "center",
            zIndex: 999,
          }}
        >
          <CircularProgress
            color="primary"
            style={{ width: "100px", height: "100px" }}
          />
        </Box>
      )}
    </>
  );
};

export default Loader;
