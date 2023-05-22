import React, { useState } from "react";

import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import {
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  TextField,
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

function ExportWindow({ setIsLoading }) {
  const [daw, setDaw] = useState(daws[0]);
  const [destination, setDestination] = useState("");

  window.electron.receive("doAction", (data) => {
    setIsLoading(false);
  });

  const handleDestinationChange = (e) => {
    setDestination("C:\\Users\\Patrick\\Desktop\\test");
  };

  const automatePos = () => {
    setIsLoading(true);
    const dawWithNoSpaces = daw.replace(" ", "");

    window.electron.send("doAction", {
      action: `export${dawWithNoSpaces}`,
      args: {},
    });
  };
  return (
    <>
      <Typography variant="h6">Select Options</Typography>

      <FormControl sx={{ minWidth: "20em" }}>
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

      <TextField sx={{ minWidth: "20em" }} label="Session ID"></TextField>

      <Grid container sx={{ minWidth: "20em" }} justifyContent="space-between">
        <TextField
          sx={{ minWidth: "14em" }}
          disabled
          label="Export Destination"
          value={destination}
        ></TextField>
        <Button onClick={handleDestinationChange} variant="outlined">
          Set
        </Button>
      </Grid>

      <Button
        onClick={automatePos}
        variant="contained"
        disabled={!!!destination}
      >
        Export
      </Button>
    </>
  );
}

export default ExportWindow;
