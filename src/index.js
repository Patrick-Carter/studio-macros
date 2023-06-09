import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { Typography, createTheme, ThemeProvider, CssBaseline, Box, Tabs, Tab, Backdrop, CircularProgress, Button } from "@mui/material";
import ExportWindow from "./pages/ExportWindow.jsx";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#303030",
    },
  },
});

const App = () => {
  const [tab, setTab] = useState("Export");
  const [isLoading, setIsLoading] = useState(false);
  const [stepMessage, setStepMessage] = useState("");

  window.electron.receive("stepMessage", (data) => {
    setStepMessage(data);
  });

  const handleContinue = () => {
    setStepMessage("");
    window.electron.send("continueAutomation", {});
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={isLoading}>
        <Grid container direction="column" alignContent="center" alignItems="center" gap={5}>
          <CircularProgress color="inherit" />
          <Typography variant="button">"ALT + SHIFT + Q" to cancel</Typography>
          {stepMessage && (
            <Grid container direction="column" alignContent="center" alignItems="center">
              <Typography variant="button">{stepMessage}</Typography>
              <Button variant="contained" onClick={handleContinue}>
                Continue
              </Button>
            </Grid>
          )}
        </Grid>
      </Backdrop>
      <CssBaseline />
      <Grid container>
        <Grid xs={12}>
          <Box>
            <Grid container gap={3} direction="column" alignContent="center" alignItems="center">
              <Tabs value={tab} onChange={(e, newValue) => setTab(newValue)} centered>
                <Tab value="Export" label="Export" />
                <Tab value="Custom Macros" label="Custom Macros" />
                <Tab value="Process" label="Process" />
                <Tab value="Settings" label="Settings" />
              </Tabs>
              {tab === "Export" && <ExportWindow setIsLoading={setIsLoading} />}
              {tab === "Custom Macros" && <div>Custom Macros is not available in this preview</div>}
              {tab === "Process" && <div>Processing suite is not available in this preview</div>}
              {tab === "Settings" && <div>Settings</div>}
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

{
  /* <Grid>
<FormGroup>
  <FormControlLabel
    control={<Checkbox defaultChecked />}
    label="Upload Files"
  />
  <FormControlLabel control={<Checkbox />} label="Required" />
  <FormControlLabel control={<Checkbox />} label="Disabled" />
</FormGroup>
</Grid> */
}

const root = createRoot(document.getElementById("root"));
root.render(<App />);
