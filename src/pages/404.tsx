import { Box, Button, Container, Grid, Typography } from "@mui/material";

export default function PageNotFound() {
  return (
    <Box
      sx={{
        backgroundColor: "#fff",
      }}
    >
      <Grid container 
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        sx={{ minHeight: '100vh' }}>
        <Grid item xs={8}>
          <img src="/VC_404.svg" alt="" width={500} height={250} />
        </Grid>
        <Grid item xs={6} sx={{ textAlign: "center", margin: 3 }}>
          <Typography variant="h6">
            The page you’re looking for doesn’t exist.
          </Typography>
          <Button href="/" variant="contained">
            Back Home
          </Button>
        </Grid>          
      </Grid>      
    </Box>
  );
}
