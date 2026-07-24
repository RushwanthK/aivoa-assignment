import {
  Typography,
  Grid,
  TextField,
  Box,
  Button,
} from "@mui/material";

import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    updateField,
    resetComplaint,
} from "../redux/complaintSlice";

import { saveComplaint } from "../services/complaintService";

import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

const SECTION_LABEL_SX = {
    fontWeight: 700,
    color: "#9297A8",
    letterSpacing: 1,
    fontSize: 13,
    textTransform: "uppercase",
};

export default function ComplaintForm() {
  const dispatch = useDispatch();

  const complaint = useSelector(
      (state) => state.complaint.formData
  );

  const [saving, setSaving] = useState(false);
  const [highlightedFields, setHighlightedFields] = useState({});
  const prevComplaintRef = useRef(complaint);

  // Detect fields that were just changed (e.g. by the AI copilot)
  // and briefly highlight them, without altering any data logic.
  useEffect(() => {
      const prev = prevComplaintRef.current;

      if (prev) {
          const changed = {};

          Object.keys(complaint || {}).forEach((key) => {
              if (prev[key] !== complaint[key]) {
                  changed[key] = true;
              }
          });

          if (Object.keys(changed).length > 0) {
              setHighlightedFields(changed);

              const timeout = setTimeout(() => {
                  setHighlightedFields({});
              }, 2500);

              prevComplaintRef.current = complaint;

              return () => clearTimeout(timeout);
          }
      }

      prevComplaintRef.current = complaint;

  }, [complaint]);

  const isReadyToCommit = Object.values(complaint || {}).every(
      (value) => String(value ?? "").trim() !== ""
  );

  const handleSave = async () => {

      try {
          setSaving(true);

          await saveComplaint(complaint);

          alert("Complaint saved successfully.");

      }

      catch (err) {

          console.error(err);

          alert("Save failed.");

      }

      finally {
          setSaving(false);
      }

  };

  const handleChange = (field) => (event) => {
    dispatch(
        updateField({
            field,
            value: event.target.value,
        })
    );
  };

  const fieldSx = (field) => {
      const isHighlighted = Boolean(highlightedFields[field]);

      return {
          "& .MuiOutlinedInput-root": {
              borderRadius: 2.5,
              transition: "background-color 0.4s ease, border-color 0.4s ease",
              bgcolor: isHighlighted ? "#E9FBF1" : "#FAFBFF",
              "& fieldset": {
                  borderColor: isHighlighted ? "#34C759" : "#E3E8F5",
              },
              "&:hover fieldset": {
                  borderColor: isHighlighted ? "#34C759" : "#C7D2E8",
              },
              "&.Mui-focused fieldset": {
                  borderColor: "#4F46E5",
              },
          },
      };
  };

  const readOnlyFieldSx = {
      "& .MuiOutlinedInput-root": {
          borderRadius: 2.5,
          bgcolor: "#FFFFFF",
          "& fieldset": {
              borderColor: "#E3DEFB",
          },
      },
  };

  return (
    <>
      {/* Header */}
      <Box
        sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 2,
            mb: 3,
        }}
      >
          <Box>
              <Typography variant="h4" fontWeight="bold">
                Log Customer Complaint
              </Typography>

              <Typography color="text.secondary" mt={0.5}>
                API & FDF Quality Assurance Module
              </Typography>
          </Box>

          <Box
            sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
            }}
          >
              <Button
                variant="outlined"
                color="secondary"
                size="small"
                sx={{ borderRadius: 3, textTransform: "none" }}
                onClick={() => dispatch(resetComplaint())}
              >
                Reset Form
              </Button>

              <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.75,
                    bgcolor: isReadyToCommit ? "#E4F9EE" : "#F1F2F6",
                    color: isReadyToCommit ? "#1F9D55" : "#77798A",
                    px: 2,
                    py: 0.75,
                    borderRadius: 5,
                    fontWeight: 600,
                    fontSize: 14,
                }}
              >
                <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                {isReadyToCommit ? "Ready to Commit" : "In Progress"}
              </Box>
          </Box>
      </Box>

      {/* Section 1 */}
      <Typography sx={{ ...SECTION_LABEL_SX, mb: 2 }}>
        1. Origin & Customer Details
      </Typography>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
            <TextField
                fullWidth
                label="Complaint Source"
                value={complaint.complaint_source}
                onChange={handleChange("complaint_source")}
                sx={fieldSx("complaint_source")}
            />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
            <TextField
                fullWidth
                label="Customer Name"
                value={complaint.customer_name}
                onChange={handleChange("customer_name")}
                sx={fieldSx("customer_name")}
            />
        </Grid>

        {/* Section 2 */}
        <Grid size={12}>
            <Typography sx={{ ...SECTION_LABEL_SX, mt: 3, mb: 1 }}>
                2. Product & Batch Identification
            </Typography>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
            <TextField
                fullWidth
                label="Product Name"
                value={complaint.product_name}
                onChange={handleChange("product_name")}
                sx={fieldSx("product_name")}
            />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
            <TextField
                fullWidth
                label="Product Strength"
                value={complaint.product_strength}
                onChange={handleChange("product_strength")}
                sx={fieldSx("product_strength")}
            />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
            <TextField
                fullWidth
                label="Batch / Lot Number"
                value={complaint.batch_number}
                onChange={handleChange("batch_number")}
                sx={fieldSx("batch_number")}
            />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
            <TextField
                fullWidth
                label="Affected Quantity"
                value={complaint.affected_quantity}
                onChange={handleChange("affected_quantity")}
                sx={fieldSx("affected_quantity")}
            />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
            <TextField
                fullWidth
                label="Manufacturing Date"
                value={complaint.manufacturing_date}
                onChange={handleChange("manufacturing_date")}
                sx={fieldSx("manufacturing_date")}
            />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
            <TextField
                fullWidth
                label="Expiry Date"
                value={complaint.expiry_date}
                onChange={handleChange("expiry_date")}
                sx={fieldSx("expiry_date")}
            />
        </Grid>

        {/* Section 3 */}
        <Grid size={12}>
            <Typography sx={{ ...SECTION_LABEL_SX, mt: 3, mb: 1 }}>
                3. Defect Analysis
            </Typography>
        </Grid>

        <Grid size={12}>
            <TextField
                fullWidth
                label="Complaint Category"
                value={complaint.complaint_type}
                onChange={handleChange("complaint_type")}
                sx={fieldSx("complaint_type")}
            />
        </Grid>

        <Grid size={12}>
            <TextField
                fullWidth
                multiline
                rows={4}
                label="Complaint Description"
                value={complaint.complaint_description}
                onChange={handleChange("complaint_description")}
                sx={fieldSx("complaint_description")}
            />
        </Grid>

        {/* Section 4 - AI Copilot Risk Assessment */}
        <Grid size={12}>
            <Box
                sx={{
                    mt: 3,
                    p: 3,
                    borderRadius: 4,
                    bgcolor: "#F7F6FE",
                    border: "1px solid #EAE6FB",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 2.5,
                    }}
                >
                    <ShieldOutlinedIcon
                        sx={{ color: "#4F46E5", fontSize: 22 }}
                    />
                    <Typography
                        fontWeight="bold"
                        sx={{ color: "#4F46E5" }}
                    >
                        AI Copilot Risk Assessment
                    </Typography>
                </Box>

                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            fullWidth
                            label="Severity (Suggested)"
                            value={complaint.severity}
                            onChange={handleChange("severity")}
                            sx={fieldSx("severity")}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            fullWidth
                            label="Priority"
                            value={complaint.priority}
                            onChange={handleChange("priority")}
                            sx={fieldSx("priority")}
                        />
                    </Grid>

                    <Grid size={12}>
                        <TextField
                            fullWidth
                            label="Suggested Next Action"
                            value={complaint.suggested_action}
                            InputProps={{ readOnly: true }}
                            sx={readOnlyFieldSx}
                        />
                    </Grid>

                    <Grid size={12}>
                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            label="Initial Risk Assessment"
                            value={complaint.risk_summary}
                            InputProps={{ readOnly: true }}
                            sx={readOnlyFieldSx}
                        />
                    </Grid>
                </Grid>
            </Box>
        </Grid>

        {/* Actions */}
        <Grid size={12} sx={{ mt: 4 }}>
            <Button
                fullWidth
                variant="contained"
                onClick={handleSave}
                disabled={saving || !isReadyToCommit}
                sx={{
                    py: 1.6,
                    borderRadius: 3,
                    bgcolor: "#4F46E5",
                    fontWeight: "bold",
                    fontSize: 16,
                    textTransform: "none",
                    "&:hover": {
                        bgcolor: "#4338CA",
                    },
                    "&.Mui-disabled": {
                        bgcolor: "#DADCE8",
                        color: "#9297A8",
                    },
                }}
            >
                {saving
                    ? "Committing..."
                    : isReadyToCommit
                    ? "Commit to QMS Ledger"
                    : "Complete All Fields to Commit"}
            </Button>
        </Grid>

      </Grid>
    </>
);
}