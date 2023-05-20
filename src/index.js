import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import {
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  createTheme,
  ThemeProvider,
  CssBaseline,
  Box,
  TextField,
  Tabs,
  Tab,
  Backdrop,
  CircularProgress,
} from "@mui/material";

const daws = [
  "FL Studio",
  "Audacity",
  "Ableton Live",
  "Pro Tools",
  "Logic Pro",
  "GarageBand",
  "Reaper",
  "Studio One",
  "Cubase",
];

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#303030",
    },
  },
});

const App = () => {
  const [daw, setDaw] = useState(daws[0]);
  const [tab, setTab] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  window.electron.receive("doAction", (data) => {
    setIsLoading(false);
  });

  const automatePos = () => {
    setIsLoading(true);
    const dawWithNoSpaces = daw.replace(" ", "");

    window.electron.send("doAction", {
      action: `export${dawWithNoSpaces}`,
      args: {},
    });
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <CssBaseline />
      <Grid container sx={{ height: "100vh" }}>
        <Grid
          xs={false}
          sm={6}
          md={6}
          sx={{
            backgroundImage:
              "url(https://wallpaperset.com/w/full/d/8/c/50187.jpg)",
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Grid xs={12} sm={6} md={6}>
          <Box>
            <Grid
              container
              gap={3}
              direction="column"
              alignContent="center"
              alignItems="center"
            >
              <Grid>
                <Tabs
                  value={tab}
                  onChange={(e, newValue) => setTab(newValue)}
                  centered
                >
                  <Tab value={1} label="Export" />
                  <Tab value={2} label="Customer Macros" />
                  <Tab value={3} label="Settings" />
                </Tabs>
              </Grid>
              <Grid>
                <Typography variant="h6">Export Options</Typography>
              </Grid>
              <Grid>
                <FormControl sx={{ minWidth: "15em", maxWidth: "15em" }}>
                  <InputLabel id="daw-select-label">Daw</InputLabel>
                  <Select
                    labelId="daw-select-label"
                    id="daw-select"
                    value={daw}
                    label="Daw"
                    onChange={(e) => setDaw(e.target.value)}
                  >
                    {daws.map((d) => {
                      return (
                        <MenuItem key={d} value={d}>
                          {d}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Grid>
              <Grid>
                <TextField
                  sx={{ minWidth: "15em", maxWidth: "15em" }}
                  label="Session ID"
                ></TextField>
              </Grid>
              <Grid>
                <Button onClick={automatePos} variant="contained">
                  Export
                </Button>
              </Grid>
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
