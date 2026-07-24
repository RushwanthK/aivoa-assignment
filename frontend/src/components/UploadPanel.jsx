import { useState } from "react";
import { useDispatch } from "react-redux";

import api from "../services/api";

import { setComplaintData } from "../redux/complaintSlice";

function UploadPanel() {

    const [text, setText] = useState("");

    const dispatch = useDispatch();

    async function extractComplaint() {

        try {

            const response = await api.post(
                "/extract/text",
                {
                    text: text
                }
            );

            dispatch(
                setComplaintData(
                    response.data
                )
            );

        }

        catch (err) {

            console.log(err);

            alert("Extraction Failed");

        }

    }

    return (

        <div>

            <h2>AI Assistant</h2>

            <textarea

                rows="18"

                style={{
                    width: "100%"
                }}

                value={text}

                onChange={(e) => setText(e.target.value)}

                placeholder="Paste complaint email..."

            />

            <br />

            <br />

            <button

                onClick={extractComplaint}

            >

                Extract Complaint

            </button>

        </div>

    );

}

export default UploadPanel;