import { Grid, Paper } from "@mui/material";
import ComplaintForm from "../components/ComplaintForm";
import AssistantPanel from "../components/AssistantPanel";

export default function ComplaintPage() {
  return (
    <Grid
      container
      spacing={2}
      sx={{
        height: "100vh",
        p: 2,
        bgcolor: "#f5f7fb",
      }}
    >
      <Grid size={{ xs: 12, md: 8 }}>
        <Paper
          sx={{
            height: "100%",
            p: 3,
            borderRadius: 3,
            overflow: "auto",
          }}
        >
          <ComplaintForm />
        </Paper>
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
        <Paper
          sx={{
            height: "100%",
            p: 2,
            borderRadius: 3,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <AssistantPanel />
        </Paper>
      </Grid>
    </Grid>
  );
}