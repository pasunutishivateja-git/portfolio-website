import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaArrowLeft, FaEnvelope } from "react-icons/fa"; 
import { motion } from "framer-motion"; 
import axios from "axios";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); 
    setIsLoading(true); 

    try {
      const res = await axios.post("https://portfolio-backend-2k8z.onrender.com/api/auth/login", {
        email: email,
        password: password,
      });

      localStorage.setItem("token", res.data.token);
      window.location.href = "/";
      
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Network error. Please try again later.");
      }
    } finally {
      setIsLoading(false); 
    }
  };

  return (
    <div className="admin-login-container">
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

          {error && <div className="login-error-message">{error}</div>}

          <motion.button
            type="submit"
            className="admin-submit-btn"
            disabled={isLoading}
            whileHover={{ scale: isLoading ? 1 : 1.02, translateY: isLoading ? 0 : -2 }}
            whileTap={{ scale: isLoading ? 1 : 0.98 }}
          >
            {isLoading ? "Authenticating..." : "Authenticate"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}

export default Login;