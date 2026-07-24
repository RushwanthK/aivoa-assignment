import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    formData: {
        complaint_source: "",
        customer_name: "",
        product_name: "",
        product_strength: "",
        batch_number: "",
        manufacturing_date: "",
        expiry_date: "",
        affected_quantity: "",
        complaint_type: "",
        complaint_description: "",
        severity: "",
        priority: "",
        risk_summary: "",
        suggested_action: "",
    },
};

const complaintSlice = createSlice({
    name: "complaint",

    initialState,

    reducers: {

        setComplaintData: (state, action) => {
            state.formData = action.payload;
        },

        updateField: (state, action) => {
            const { field, value } = action.payload;

            state.formData[field] = value;
        },

        updateFields: (state, action) => {

            Object.assign(
                state.formData,
                action.payload
            );

        },

        resetComplaint: (state) => {
            state.formData = initialState.formData;
        },
    },
});

export const {
    setComplaintData,
    updateField,
    updateFields,
    resetComplaint,
} = complaintSlice.actions;

export default complaintSlice.reducer;