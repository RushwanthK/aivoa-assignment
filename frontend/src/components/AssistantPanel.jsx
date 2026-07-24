import {
    Typography,
    TextField,
    Box,
    Paper,
    IconButton,
    LinearProgress,
} from "@mui/material";

import ScienceOutlinedIcon from "@mui/icons-material/ScienceOutlined";
import PersonIcon from "@mui/icons-material/Person";
import CheckIcon from "@mui/icons-material/Check";
import BoltIcon from "@mui/icons-material/Bolt";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import DescriptionIcon from "@mui/icons-material/Description";
import CloseIcon from "@mui/icons-material/Close";

import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    extractComplaint,
    uploadComplaintPDF,
    chatCopilot,
} from "../services/complaintService";

import {
    setComplaintData,
    updateFields,
} from "../redux/complaintSlice";

export default function AssistantPanel() {

    const dispatch = useDispatch();
    const formData = useSelector(
        (state) => state.complaint.formData
    );

    const [inputMessage, setInputMessage] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);


    const [copilotLoading, setCopilotLoading] = useState(false);
    const [messages, setMessages] = useState([
        {
            sender: "assistant",
            text: `Hello 👋

                Upload a complaint PDF or paste a complaint email below.

                I'll extract the complaint details, assess risk, and populate the complaint form automatically.`
        }
    ]);

    const chatEndRef = useRef(null);
    const fileInputRef = useRef(null);


    const addMessage = (sender, text) => {

        setMessages((prev) => [

            ...prev,

            {

                sender,

                text

            }

        ]);

    };

    const isComplaintEmpty = () => {

        return (
            !formData.product_name &&
            !formData.batch_number &&
            !formData.complaint_description
        );

    };

    useEffect(() => {

                chatEndRef.current?.scrollIntoView({

                    behavior: "smooth"

                });

     }, [messages, copilotLoading]);


     const handleSend = async () => {

        if (!selectedFile && !inputMessage.trim())
            return;

        try {

            setCopilotLoading(true);

            /*
            CASE 1
            PDF attached
            */

            if (selectedFile) {

                addMessage(
                    "user",
                    `📄 ${selectedFile.name}`
                );

                const data =
                    await uploadComplaintPDF(selectedFile);

                dispatch(setComplaintData(data));

                addMessage(
                    "assistant",
                    `Complaint successfully analyzed.

                    ✅ Complaint details extracted

                    • Severity: ${data.severity}

                    • Priority: ${data.priority}

                    The complaint form has been populated and is ready for review.`
                );

                setSelectedFile(null);

                setInputMessage("");

                return;
            }

            /*
            CASE 2
            First complaint text
            */

            if (isComplaintEmpty()) {

                addMessage(
                    "user",
                    inputMessage
                );

                const data =
                    await extractComplaint(inputMessage);

                dispatch(setComplaintData(data));

                addMessage(
                    "assistant",
                    `Complaint extracted successfully.

    Severity: ${data.severity}

    Priority: ${data.priority}

    The complaint form has been populated.`
                );

                setInputMessage("");

                return;
            }

            /*
            CASE 3
            AI update
            */

            addMessage(
                "user",
                inputMessage
            );

            const response =
                await chatCopilot(
                    inputMessage,
                    formData
                );

            dispatch(
                updateFields(response.updates)
            );

            addMessage(
                "assistant",
                response.reply
            );

            setInputMessage("");

        }

        catch (err) {

            console.error(err);

            alert("AI Assistant failed.");

        }

        finally {

            setCopilotLoading(false);

        }

    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const loadingLabel = selectedFile
        ? "Extracting tabular data via OCR..."
        : "Thinking...";

    return (
        <Paper
            elevation={3}
            sx={{
                p: 0,
                borderRadius: 4,
                height: "100%",
                maxHeight: "100vh",
                minHeight: 0,
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                bgcolor: "#FFFFFF",
            }}
        >
            {/* Header */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    px: 3,
                    pt: 3,
                    pb: 2,
                    borderBottom: "1px solid #EEF0F4",
                }}
            >
                <Box>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                        }}
                    >
                        <ScienceOutlinedIcon
                            sx={{ color: "#4F46E5", fontSize: 26 }}
                        />
                        <Typography
                            variant="h6"
                            fontWeight="bold"
                        >
                            AIVOA Copilot
                        </Typography>
                    </Box>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        mt={0.5}
                    >
                        Drop complaint files or paste text below.
                    </Typography>
                </Box>

                <Box
                    sx={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        bgcolor: "#4F46E5",
                        mt: 0.5,
                    }}
                />
            </Box>

            {/* Conversation */}
            <Box
                sx={{
                    flex: 1,
                    minHeight: 0,
                    overflowY: "auto",
                    px: 3,
                    py: 2,
                    bgcolor: "#FAFAFC",
                }}
            >
                {
                    messages.map((message, index) => {

                        const isUser = message.sender === "user";
                        const isFileMessage =
                            isUser && message.text.startsWith("📄 ");

                        return (
                            <Box
                                key={index}
                                sx={{
                                    mb: 2.5,
                                    display: "flex",
                                    justifyContent: isUser ? "flex-end" : "flex-start",
                                    alignItems: "center",   // <-- changed
                                    gap: 1.5,
                                }}
                            >
                                {!isUser && (
                                    <Box
                                        sx={{
                                            width: 36,
                                            height: 36,
                                            minWidth: 36,
                                            borderRadius: "50%",
                                            bgcolor: "#EDEBFC",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            alignSelf: "flex-start",
                                            
                                        }}
                                    >
                                        <CheckIcon
                                            sx={{ fontSize: 18, color: "#4F46E5" }}
                                        />
                                    </Box>
                                )}

                                {isFileMessage ? (
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 1.5,
                                            bgcolor: "#FFFFFF",
                                            border: "1px solid #EEF0F4",
                                            borderRadius: 3,
                                            p: 1.5,
                                            maxWidth: "85%",
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                width: 36,
                                                height: 36,
                                                borderRadius: 2,
                                                bgcolor: "#FDE8EC",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                            }}
                                        >
                                            <DescriptionIcon
                                                sx={{ color: "#E4536B", fontSize: 20 }}
                                            />
                                        </Box>
                                        <Box>
                                            <Typography
                                                fontWeight="bold"
                                                fontSize={14}
                                            >
                                                {message.text.replace("📄 ", "")}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                            >
                                                PDF Document
                                            </Typography>
                                        </Box>
                                    </Box>
                                ) : (
                                    <Box
                                        sx={{
                                            bgcolor: isUser
                                                ? "#4F46E5"
                                                : "#F5F7FB",
                                            color: isUser
                                                ? "white"
                                                : "black",
                                            p: 2,
                                            borderRadius: 4,
                                            maxWidth: "85%",
                                        }}
                                    >
                                        <Typography whiteSpace="pre-line">
                                            {message.text}
                                        </Typography>
                                    </Box>
                                )}

                                {isUser && (
                                    <Box
                                        sx={{
                                            width: 36,
                                            height: 36,
                                            minWidth: 36,
                                            borderRadius: "50%",
                                            bgcolor: "#E9E9EF",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            alignSelf: "flex-start",
                                            
                                        }}
                                    >
                                        <PersonIcon
                                            sx={{ fontSize: 18, color: "#5B5B66" }}
                                        />
                                    </Box>
                                )}
                            </Box>
                        );
                    })
                }

                {copilotLoading && (
                    <Box
                        display="flex"
                        alignItems="flex-start"
                        gap={2}
                        mb={1}
                    >
                        <Box
                            sx={{
                                width: 32,
                                height: 32,
                                minWidth: 32,
                                borderRadius: "50%",
                                bgcolor: "#EDEBFC",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <BoltIcon
                                sx={{ fontSize: 18, color: "#4F46E5" }}
                            />
                        </Box>

                        <Box
                            sx={{
                                bgcolor: "#F5F7FB",
                                p: 2,
                                borderRadius: 4,
                                minWidth: 260,
                            }}
                        >
                            <Typography fontSize={14} mb={1}>
                                {loadingLabel}
                            </Typography>
                            <LinearProgress
                                sx={{
                                    borderRadius: 2,
                                    height: 6,
                                    bgcolor: "#E4E2F5",
                                    "& .MuiLinearProgress-bar": {
                                        bgcolor: "#4F46E5",
                                    },
                                }}
                            />
                        </Box>
                    </Box>
                )}

                <div ref={chatEndRef} />
            </Box>

            {/* Selected file preview (before sending) */}
            {selectedFile && (
                <Box
                    sx={{
                        mx: 3,
                        mb: 1.5,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        bgcolor: "#F5F7FB",
                        border: "1px solid #EEF0F4",
                        borderRadius: 3,
                        p: 1.5,
                    }}
                >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Box
                            sx={{
                                width: 36,
                                height: 36,
                                borderRadius: 2,
                                bgcolor: "#FDE8EC",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <DescriptionIcon
                                sx={{ color: "#E4536B", fontSize: 20 }}
                            />
                        </Box>
                        <Box>
                            <Typography fontWeight="bold" fontSize={14}>
                                {selectedFile.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                PDF Document
                            </Typography>
                        </Box>
                    </Box>

                    <IconButton
                        size="small"
                        onClick={() => setSelectedFile(null)}
                    >
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </Box>
            )}

            {/* Input bar */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    m: 3,
                    mt: selectedFile ? 0 : 3,
                    p: 0.75,
                    pl: 1.5,
                    border: "1px solid #E0E0E0",
                    borderRadius: 8,
                    bgcolor: "#FFFFFF",
                }}
            >
                <IconButton
                    size="small"
                    onClick={() => fileInputRef.current?.click()}
                >
                    <AttachFileIcon sx={{ color: "#8A8A99" }} />
                </IconButton>

                <input
                    ref={fileInputRef}
                    hidden
                    type="file"
                    accept=".pdf"
                    onChange={(e) => {
                        setSelectedFile(e.target.files[0]);
                    }}
                />

                <TextField
                    fullWidth
                    variant="standard"
                    placeholder="Type a message or paste a complaint..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    multiline
                    maxRows={4}
                    InputProps={{
                        disableUnderline: true,
                    }}
                />

                <IconButton
                    onClick={handleSend}
                    disabled={copilotLoading || (!selectedFile && !inputMessage.trim())}
                    sx={{
                        bgcolor: "#4F46E5",
                        color: "white",
                        width: 40,
                        height: 40,
                        "&:hover": {
                            bgcolor: "#4338CA",
                        },
                        "&.Mui-disabled": {
                            bgcolor: "#C7C6EF",
                            color: "white",
                        },
                    }}
                >
                    <CheckIcon fontSize="small" />
                </IconButton>
            </Box>

            {/* Footer */}
            <Typography
                variant="caption"
                align="center"
                sx={{
                    display: "block",
                    color: "#B5B5C0",
                    letterSpacing: 1,
                    pb: 2,
                }}
            >
                POWERED BY LANGGRAPH
            </Typography>
        </Paper>
    );
}