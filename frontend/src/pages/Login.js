import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaArrowLeft, FaEnvelope } from "react-icons/fa"; 
import { motion } from "framer-motion"; 
import axios from "axios"; // <-- NEW: Imported axios to make API calls
import "./Login.css";

function Login() {
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  // NEW: States to handle loading and errors
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  // NEW: Converted to an async function to wait for the backend
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Clear any old errors
    setIsLoading(true); // Start the loading animation

    try {
      // NOTE: Verify this URL matches exactly where your authRoutes are mounted!
      // It might be "/api/auth/login" or just "/api/login" depending on your server.js
      const res = await axios.post("https://portfolio-backend-2k8z.onrender.com/api/auth/login", {
        email: email,
        password: password,
      });

      // If the backend says YES, grab the real token!
      localStorage.setItem("token", res.data.token);
      window.location.href = "/";
      
    } catch (err) {
      // If the backend says NO, show the error message to the user
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Network error. Please try again later.");
      }
    } finally {
      setIsLoading(false); // Stop loading regardless of success or failure
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

          {/* NEW: Displays the error message in red if it exists */}
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