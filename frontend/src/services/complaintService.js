import api from "./api";

export const extractComplaint = async (text) => {
    const response = await api.post("/extract/text", {
        text,
    });

    return response.data;
};

export const uploadComplaintPDF = async (file) => {
    const formData = new FormData();

    formData.append("file", file);

    const response = await api.post(
        "/extract/pdf",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return response.data;
};

export const chatCopilot = async (
    message,
    currentData
) => {

    const response = await api.post(
        "/chat",
        {
            message,
            current_data: currentData,
        }
    );

    return response.data;
};

export const saveComplaint = async (complaint) => {
    const response = await api.post(
        "/complaints",
        complaint
    );

    return response.data;
};