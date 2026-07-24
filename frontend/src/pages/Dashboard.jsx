import ComplaintForm from "../components/ComplaintForm";
import UploadPanel from "../components/UploadPanel";

function Dashboard() {
    return (
        <div
            style={{
                display: "flex",
                gap: "20px",
                padding: "20px",
                height: "100vh",
                boxSizing: "border-box",
                background: "#f5f5f5",
            }}
        >
            <div
                style={{
                    flex: 2,
                    background: "white",
                    padding: "20px",
                    borderRadius: "8px",
                }}
            >
                <ComplaintForm />
            </div>

            <div
                style={{
                    flex: 1,
                    background: "white",
                    padding: "20px",
                    borderRadius: "8px",
                }}
            >
                <UploadPanel />
            </div>
        </div>
    );
}

export default Dashboard;