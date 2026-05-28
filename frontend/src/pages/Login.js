import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaArrowLeft, FaEnvelope } from "react-icons/fa"; 
import { motion } from "framer-motion"; 
import "./Login.css";

function Login() {
  const [email, setEmail] = useState(""); // <-- New Email State
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    
    // TEMPORARY BYPASS: Checks if BOTH fields are typed in
    if (email.length > 0 && password.length > 0) {
      localStorage.setItem("token", "admin-vip-pass");
      window.location.href = "/";
    }
  };

  return (
    <div className="admin-login-container">
      {/* Decorative Glowing Blobs */}
      <div className="login-glow blob-1"></div>
      <div className="login-glow blob-2"></div>

      <motion.div
        className="admin-login-card"
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <button className="back-btn" onClick={() => navigate("/")}>
          <FaArrowLeft /> Back to Home
        </button>

        <h2 className="admin-title">Admin Access</h2>
        <p className="admin-subtitle">Enter your credentials to manage the portfolio.</p>

        <form onSubmit={handleLogin} className="admin-form">
          
          {/* ================= NEW EMAIL FIELD ================= */}
          <div className="input-wrapper">
            <input
              type="email"
              placeholder="Admin Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={email.length > 0 ? "filled-box" : ""}
            />
            <span className="static-icon">
              <FaEnvelope />
            </span>
          </div>

          {/* ================= PASSWORD FIELD ================= */}
          <div className="input-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={password.length > 0 ? "filled-box" : ""}
            />
            <span
              className="eye-icon-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <motion.button
            type="submit"
            className="admin-submit-btn"
            whileHover={{ scale: 1.02, translateY: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            Authenticate
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}

export default Login;