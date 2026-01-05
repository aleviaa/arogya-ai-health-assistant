import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);

    // Fake login delay (optional, for UX)
    setTimeout(() => {
      navigate("/chat");
    }, 500);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>AROGYA</h1>
        <p style={styles.subtitle}>
          Your AI-Powered Health Assistant
        </p>

        <button
          style={styles.button}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Entering..." : "Continue to Chat"}
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    width: "100vw",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#E8EEF7",
  },
  card: {
    background: "white",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
    textAlign: "center",
    width: "320px",
  },
  title: {
    fontSize: "32px",
    fontWeight: "700",
    color: "#0066FF",
    marginBottom: "10px",
    letterSpacing: "2px",
  },
  subtitle: {
    fontSize: "14px",
    color: "#555",
    marginBottom: "30px",
  },
  button: {
    width: "100%",
    padding: "12px",
    background: "#0066FF",
    color: "white",
    border: "none",
    borderRadius: "25px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
  },
};
