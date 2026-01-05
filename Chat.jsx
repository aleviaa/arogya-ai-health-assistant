import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import "../pages/chat.css";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [showWelcome, setShowWelcome] = useState(true);
  const [userName, setUserName] = useState("User");
  const chatEndRef = useRef(null);
  const navigate = useNavigate();

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Handle back navigation
  const handleBack = () => {
    navigate(-1);
  };

  // auto scroll down when new message arrives
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // sending message
  async function sendMessage() {
    if (!input.trim()) return;

    if (showWelcome) setShowWelcome(false);

    const userMessage = {
      sender: "user",
      text: input,
    };

    setMessages(prev => [...prev, userMessage]);

    try {
      const res = await fetch("http://localhost:3000/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input }),
      });

      const data = await res.json();
      setMessages(prev => [...prev, { sender: "bot", text: data.reply }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        sender: "bot", 
        text: "Sorry, I encountered an error. Please try again." 
      }]);
    }

    setInput("");
  }

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Generate PDF Report
  const generatePDFReport = () => {
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(20);
    doc.setTextColor(0, 102, 255);
    doc.text("AROGYA Health Report", 20, 20);
    
    // Date
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 30);
    
    // Patient Info
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text("Patient Information:", 20, 45);
    doc.setFontSize(11);
    doc.text(`Name: ${userName}`, 20, 55);
    
    // Extract symptoms and analysis from messages
    let symptoms = [];
    let analysis = [];
    
    messages.forEach(msg => {
      if (msg.sender === "user") {
        symptoms.push(msg.text);
      } else if (msg.sender === "bot") {
        analysis.push(msg.text);
      }
    });
    
    // Symptoms
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text("Reported Symptoms:", 20, 70);
    doc.setFontSize(10);
    let yPos = 80;
    symptoms.forEach((symptom, idx) => {
      const lines = doc.splitTextToSize(`${idx + 1}. ${symptom}`, 170);
      doc.text(lines, 20, yPos);
      yPos += lines.length * 5 + 5;
    });
    
    // Analysis
    yPos += 5;
    doc.setFontSize(14);
    doc.text("AI Analysis & Recommendations:", 20, yPos);
    yPos += 10;
    doc.setFontSize(10);
    
    if (analysis.length > 0) {
      const lastAnalysis = analysis[analysis.length - 1];
      const lines = doc.splitTextToSize(lastAnalysis, 170);
      lines.forEach(line => {
        if (yPos > 270) {
          doc.addPage();
          yPos = 20;
        }
        doc.text(line, 20, yPos);
        yPos += 5;
      });
    }
    
    // Disclaimer
    yPos += 10;
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }
    doc.setFontSize(9);
    doc.setTextColor(150);
    doc.text("Disclaimer: This is an AI-generated report and should not replace professional medical advice.", 20, yPos, { maxWidth: 170 });
    doc.text("Please consult a healthcare provider for proper diagnosis and treatment.", 20, yPos + 5, { maxWidth: 170 });
    
    // Save PDF
    doc.save(`Arogya_Health_Report_${new Date().getTime()}.pdf`);
  };

  return (
    <div className="chat-container">
      {/* Header */}
      <div className="chat-header">
        <button className="back-btn" onClick={handleBack}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="header-title">AROGYA</h1>
        <div className="header-actions">
          <button className="pdf-btn" onClick={generatePDFReport} title="Generate PDF Report">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* Chat Area */}
      <div className="chat-box">
        {showWelcome && messages.length === 0 ? (
          <div className="welcome-screen">
            <h2>WELCOME TO</h2>
            <h1>AROGYA</h1>
            <p className="welcome-subtitle">HOW CAN WE HELP YOU TODAY?</p>
            <p className="welcome-description">
              Arogya is a Generative AI-Powered Health Assistant, Professional Medical Bot by AROGYA Make Anxiety free life Secured
            </p>
            <div className="greeting-indicator">
              <span className="greeting-dot"></span>
              <span>Arogya is greeting...</span>
            </div>
          </div>
        ) : (
          <>
            {messages.map((m, i) => (
              <div key={i} className={`message-row ${m.sender === "user" ? "user-row" : "bot-row"}`}>
                <div className={`message-bubble ${m.sender === "user" ? "user-bubble" : "bot-bubble"}`}>
                  {m.text}
                </div>
                <span className="message-time">
                  {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
            <div ref={chatEndRef}></div>
          </>
        )}
      </div>

      {/* Input Area */}
      <div className="input-area">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Describe your symptoms..."
          className="chat-input"
        />
        <button className="mic-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0066FF" strokeWidth="2">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8" />
          </svg>
        </button>
        <button className="send-btn" onClick={sendMessage}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
            <path d="M2 21l21-9L2 3v7l15 2-15 2z" />
          </svg>
        </button>
      </div>
    </div>
  );
}