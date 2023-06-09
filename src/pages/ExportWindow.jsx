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
  "Studio One",
  "Logic Pro",
  "Pro Tools",
  "GarageBand",
  "Ableton Live",
  "Reaper",
  "Cubase",
];

function ExportWindow({ setIsLoading }) {
  const [daw, setDaw] = useState(daws[0]);
  const [destination, setDestination] = useState("");

  window.electron.receive("doAction", (data) => {
    setIsLoading(false);
  });

  window.electron.receive("selectDirectory", (data) => {
    setIsLoading(false);
    setDestination(data);
  });

  const automatePos = () => {
    setIsLoading(true);
    const dawWithNoSpaces = daw.replace(" ", "");

    window.electron.send("doAction", {
      action: `export${dawWithNoSpaces}`,
      args: { exportDestination: destination },
    });
  };

  const handleDestinationChange = () => {
    setIsLoading(true);
    window.electron.send("selectDirectory", {});
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
