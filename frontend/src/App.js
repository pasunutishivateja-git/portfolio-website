import React, { useEffect, useState, useRef } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { motion, useScroll, useSpring } from "framer-motion";
import axios from "axios";
import emailjs from "@emailjs/browser";

// --- Assets & Icons ---
import profileImage from "./assets/logo.jpg";
import { FaGithub, FaLinkedin, FaEnvelope, FaMoon, FaSun, FaWhatsapp, FaDownload, FaAward } from "react-icons/fa";
import "./App.css";

// --- Components ---
import Login from "./pages/Login";

function App() {
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("portfolio-theme");
    return savedTheme === "light" ? false : true;
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const token = localStorage.getItem("token");
    if (!token) return false;
    
    try {
      // Decode the middle part of the token to read its data
      const payload = JSON.parse(atob(token.split('.')[1]));
      
      // Check if the expiration time has passed
      if (payload.exp * 1000 < Date.now()) {
        localStorage.removeItem("token"); // Auto-delete dead token
        return false; 
      }
      return true; // Token is alive and well
    } catch (e) {
      return false; // If the token is corrupted, log out
    }
  });

  // --- Projects State ---
  const [projects, setProjects] = useState([]);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    title: "", description: "", technologies: "", githubLink: "",
  });
  const [savedTech, setSavedTech] = useState([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // --- Certificates State (Upgraded to MongoDB!) ---
  const [certifications, setCertifications] = useState([]);
  const [certFormData, setCertFormData] = useState({ title: "", issuer: "", date: "" });
  const [editCertId, setEditCertId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);

  // Fetch Certificates on load (Add this to your existing useEffect)
  useEffect(() => {
    fetchProjects();
    fetchCertifications(); // <-- Call the new fetch function
    const storedTech = JSON.parse(localStorage.getItem("myTechSuggestions")) || [];
    setSavedTech(storedTech);
    setTimeout(() => setLoading(false), 1200);
  }, []);

  // The Fetch Function
  const fetchCertifications = async () => {
    try {
      const res = await axios.get("https://portfolio-backend-2k8z.onrender.com/api/certifications");
      setCertifications(res.data);
    } catch (err) { console.error(err); }
  };

  // --- Handlers: Certificates ---
  const handleCertChange = (e) => setCertFormData({ ...certFormData, [e.target.name]: e.target.value });

  const handleCertSubmit = async (e) => {
    e.preventDefault();
    try {
      const currentToken = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${currentToken}` } };

      if (editCertId) {
        await axios.put(`https://portfolio-backend-2k8z.onrender.com/api/certifications/${editCertId}`, certFormData, config);
        setEditCertId(null);
      } else {
        await axios.post("https://portfolio-backend-2k8z.onrender.com/api/certifications", certFormData, config);
      }
      
      fetchCertifications(); // Refresh the list from MongoDB!
      setCertFormData({ title: "", issuer: "", date: "" });
    } catch (error) { console.error("Error saving cert:", error); }
  };

  const deleteCert = async (id) => {
  try {
    const currentToken = localStorage.getItem("token");
    const config = { headers: { Authorization: `Bearer ${currentToken}` } };
    
    await axios.delete(`https://portfolio-backend-2k8z.onrender.com/api/certifications/${id}`, config);
    
    // Notice the c._id right here!
    setCertifications(certifications.filter(c => c._id !== id));
  } catch (error) {
    console.error("Error deleting cert:", error);
  }
};

  const editCert = (cert) => {
    setCertFormData({ title: cert.title, issuer: cert.issuer, date: cert.date });
    setEditCertId(cert._id); // Make sure this is _id for MongoDB!
    const formSection = document.getElementById("admin-certs");
    if (formSection) formSection.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // --- Contact State ---
  const [contactData, setContactData] = useState({ name: "", email: "", message: "" });

  const navigate = useNavigate();

  // --- Effects ---
  useEffect(() => {
    fetchProjects();
    const storedTech = JSON.parse(localStorage.getItem("myTechSuggestions")) || [];
    setSavedTech(storedTech);
    setTimeout(() => setLoading(false), 1200);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.remove("light-mode");
      document.body.classList.add("dark-mode");
      localStorage.setItem("portfolio-theme", "dark");
    } else {
      document.body.classList.remove("dark-mode");
      document.body.classList.add("light-mode");
      localStorage.setItem("portfolio-theme", "light");
    }
  }, [darkMode]);

  // Save certificates to local storage whenever they change
  useEffect(() => {
    localStorage.setItem("my-certifications", JSON.stringify(certifications));
  }, [certifications]);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // --- Handlers: Projects ---
  const updateSuggestions = (newTechString) => {
    if (!newTechString) return;
    const updatedList = [...new Set([...savedTech, newTechString])];
    setSavedTech(updatedList);
    localStorage.setItem("myTechSuggestions", JSON.stringify(updatedList));
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  
  const handleTechChange = (e) => {
    const userInput = e.target.value;
    setFormData({ ...formData, technologies: userInput });
    if (userInput.length > 0) {
      const unlinked = savedTech.filter((tech) => tech.toLowerCase().includes(userInput.toLowerCase()));
      setFilteredSuggestions(unlinked);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const selectSuggestion = (tech) => {
    setFormData({ ...formData, technologies: tech });
    setShowSuggestions(false);
  };

  const fetchProjects = async () => {
    try {
      const res = await axios.get("https://portfolio-backend-2k8z.onrender.com/api/projects");
      setProjects(res.data);
    } catch (err) { console.error(err); }
  };

  // --- Cloudinary Upload Function ---
  const handleImageUpload = async (file) => {
    if (!file) return "";
    
    setIsUploading(true);
    const uploadData = new FormData();
    uploadData.append("image", file);

    try {
      // Make sure your backend server is running on port 5000!
      const response = await axios.post("https://portfolio-backend-2k8z.onrender.com/api/upload", uploadData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      setIsUploading(false);
      return response.data.url; // Returns the secure Cloudinary URL
    } catch (error) {
      console.error("Upload error:", error);
      setIsUploading(false);
      alert("Image upload failed. Check the console.");
      return "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 1. Secure the Image URL
    let finalImageUrl = "";
    if (imageFile) {
      finalImageUrl = await handleImageUpload(imageFile);
    } else if (editId) {
      // KEEP the old image if we are just editing text!
      const existingProject = projects.find(p => p._id === editId);
      finalImageUrl = existingProject ? existingProject.imageUrl : "";
    }

    // 2. Package the payload
    const newProject = {
      title: formData.title,
      description: formData.description,
      technologies: formData.technologies,
      imageUrl: finalImageUrl, 
      githubLink: formData.githubLink
    };
    
    try {
      const currentToken = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${currentToken}` } };

      if (editId) {
        await axios.put(`https://portfolio-backend-2k8z.onrender.com/api/projects/${editId}`, newProject, config);
        setEditId(null);
      } else {
        await axios.post("https://portfolio-backend-2k8z.onrender.com/api/projects", newProject, config);
      }
      
      fetchProjects();
      updateSuggestions(formData.technologies);
      setFormData({ title: "", description: "", technologies: "", githubLink: "" });
      
      // 3. Clear the file state and input box
      setImageFile(null); 
      if (fileInputRef.current) fileInputRef.current.value = ""; 
      
      alert("Project saved successfully!");
    } catch (error) { 
      console.error("Error saving project:", error); 
      alert("Something went wrong!");
    }
  };

  const deleteProject = async (id) => {
    try {
      const currentToken = localStorage.getItem("token");
      await axios.delete(`https://portfolio-backend-2k8z.onrender.com/api/projects/${id}`, {
        headers: { Authorization: `Bearer ${currentToken}` },
      });
      fetchProjects();
    } catch (error) { console.error(error); }
  };

  const editProject = (project) => {
    setFormData({
      title: project.title, description: project.description,
      technologies: project.technologies.join(", "), githubLink: project.githubLink,
    });
    setEditId(project._id);
    const formSection = document.getElementById("admin-projects");
    if (formSection) formSection.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // --- Handlers: Contact ---
  const handleContactChange = (e) => setContactData({ ...contactData, [e.target.name]: e.target.value });
  const sendEmail = (e) => {
    e.preventDefault();
    emailjs.send("service_jcwz5az", "template_84bnhae", contactData, "68PSl9RYGeUNFwyWF")
      .then(() => {
        alert("Message Sent Successfully!");
        setContactData({ name: "", email: "", message: "" });
      }).catch((error) => console.error(error));
  };

  if (loading) {
    return <div className="loader"><h1>Shiva Teja</h1></div>;
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/admin-login" element={<Login />} />

      <Route path="/" element={
        <div className={`app ${darkMode ? "dark" : "light"}`}>
          <motion.div className="scroll-progress" style={{ scaleX }} />

          <nav className="navbar">
            <div className="nav-left">
              <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
                {darkMode ? <FaSun /> : <FaMoon />}
              </button>
              <h2 className="logo">Shiva Teja</h2>
            </div>
            <div className="nav-links">
              <a href="#home">Home</a>
              <a href="#about">About</a>
              <a href="#education">Education</a>
              <a href="#skills">Skills</a>
              <a href="#certifications">Certifications</a>
              <a href="#projects">Projects</a>
              <a href="#contact">Contact</a>
              <button
                className={`auth-btn ${isLoggedIn ? "logged-in" : ""}`}
                style={{ color: !darkMode ? "#1a1a2e" : "#ffffff", borderColor: !darkMode ? "#1a1a2e" : "#ffffff" }}
                onClick={() => {
                  if (isLoggedIn) {
                    localStorage.removeItem("token");
                    setIsLoggedIn(false);
                    window.location.href = "/";
                  } else { navigate("/login"); }
                }}
              >
                {isLoggedIn ? "Logout" : "Login"}
              </button>
            </div>
            <div className="nav-controls">
              <div className="hamburger" onClick={toggleSidebar}>
                <div className="line"></div><div className="line"></div><div className="line"></div>
              </div>
            </div>
          </nav>

          <div className={`sidebar-overlay ${isSidebarOpen ? "active" : ""}`} onClick={toggleSidebar}></div>
          <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
            <div className="sidebar-header">
              <h3>Admin</h3>
              <button className="close-btn" onClick={toggleSidebar}>&times;</button>
            </div>
            <div className="sidebar-content">
              {isLoggedIn ? (
                <button className="sidebar-action-btn logout" onClick={() => { localStorage.removeItem("token"); setIsLoggedIn(false); window.location.reload(); }}>Logout</button>
              ) : (
                <button className="sidebar-action-btn login" onClick={() => { toggleSidebar(); navigate("/login"); }}>Admin Login</button>
              )}
            </div>
          </div>

          <motion.section className="hero" id="home" initial={{ opacity: 0, y: 70 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
            <motion.h1 className="animated-text" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>Full Stack Developer</motion.h1>
            <motion.div className="hero-avatar" animate={{ y: [0, -15, 0] }} transition={{ duration: 4, repeat: Infinity }}>
              <img src={profileImage} alt="Profile" />
            </motion.div>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
              I am an AI & ML Engineering student and Full-Stack Developer. I build intelligent, scalable web applications by combining the MERN stack with predictive modeling and Generative AI.
            </motion.p>
            <div className="hero-buttons">
              <a href="https://github.com/pasunutishivateja-git" target="_blank" rel="noreferrer" className="hero-link">
                <div className="hero-btn"><FaGithub /><span>GitHub</span></div>
              </a>
              <a href="https://www.linkedin.com/in/shiva-teja-pasunuti-961286331/" target="_blank" rel="noreferrer" className="hero-link">
                <div className="hero-btn"><FaLinkedin /><span>LinkedIn</span></div>
              </a>
              <a href="/resume.pdf" download="Shiva_Teja_Resume.pdf" className="hero-link">
                <div className="hero-btn">
                  <FaDownload /><span>Resume</span>
                </div>
              </a>
            </div>
          </motion.section>

          <section className="about" id="about">
            <h2 className="section-title">About Me</h2>
            <p>I am a passionate Computer Science student at Vaagdevi College of Engineering specializing in Artificial Intelligence and Machine Learning. I bridge the gap between data science and web development, leveraging my skills in React, Node.js, and Python to create dynamic, data-driven applications that solve real-world problems.</p>
          </section>

          <section className="education" id="education">
            <h2 className="section-title">Education</h2>
            <div className="timeline">
              <div className="timeline-item"><div className="timeline-dot"></div><div className="timeline-content"><h3>B.Tech in Computer Science Engineering (AI&ML)</h3><p className="timeline-date">2023 - 2027</p><p>Vaagdevi Engineering College</p><p className="timeline-grade">CGPA: 7.01</p></div></div>
              <div className="timeline-item"><div className="timeline-dot"></div><div className="timeline-content"><h3>Intermediate (Class XII)</h3><p className="timeline-date">2021 - 2023</p><p>Vidwan Junior College</p><p className="timeline-grade">Percentage: 87%</p></div></div>
              <div className="timeline-item"><div className="timeline-dot"></div><div className="timeline-content"><h3>High School (Class X)</h3><p className="timeline-date">2021</p><p>Froebel Model High School</p><p className="timeline-grade">CGPA: 10</p></div></div>
            </div>
          </section>

          <section className="skills" id="skills">
            <h2 className="section-title">Skills</h2>
            <div className="skills-container">
              {["HTML", "CSS", "JavaScript", "React", "Node.js", "Python"].map((skill, index) => (
                <motion.div key={index} className="skill-card" whileHover={{ scale: 1.08 }}>{skill}</motion.div>
              ))}
            </div>
          </section>

          {/* =========================================
              NEW: CERTIFICATE ADMIN FORM
              ========================================= */}
          {isLoggedIn && (
            <section className="project-wrapper" id="admin-certs" style={{ marginTop: "40px" }}>
              <form className="project-form" onSubmit={handleCertSubmit}>
                <h2 className="section-title">{editCertId ? "Update Certificate" : "Add New Certificate"}</h2>
                <div className="form-grid">
                  <input type="text" name="title" placeholder="Certificate Title (e.g. Meta Front-End)" value={certFormData.title} onChange={handleCertChange} autoComplete="off" className={certFormData.title ? "filled-box" : ""} required />
                  <input type="text" name="issuer" placeholder="Issuer (e.g. Coursera)" value={certFormData.issuer} onChange={handleCertChange} autoComplete="off" className={certFormData.issuer ? "filled-box" : ""} required />
                  <input type="text" name="date" placeholder="Date (e.g. August 2026)" value={certFormData.date} onChange={handleCertChange} autoComplete="off" className={certFormData.date ? "filled-box" : ""} required />
                </div>
                <div style={{ display: "flex", gap: "15px", width: "100%", marginTop: "15px" }}>
                  <button type="submit" style={{ flex: 1 }}>{editCertId ? "Update Certificate" : "Add Certificate"}</button>
                  {editCertId && (
                    <button type="button" className="cancel-btn" onClick={() => { setEditCertId(null); setCertFormData({ title: "", issuer: "", date: "" }); }}>Cancel Edit</button>
                  )}
                </div>
              </form>
            </section>
          )}

          <section className="certifications" id="certifications">
            <h2 className="section-title">Certifications</h2>
            {certifications.length === 0 ? <div className="no-projects">No certifications added</div> : (
              <div className="cert-grid" style={{ display: "flex", gap: "20px", justifyContent: "center", flexWrap: "wrap", padding: "20px 0" }}>
                {certifications.map((cert) => (
                  <motion.div 
                    className="cert-card" 
                    key={cert.id} 
                    whileHover={{ y: -8 }}
                    style={{ 
                      background: darkMode ? "#1a1a2e" : "#f4f4f9", padding: "20px", borderRadius: "12px", width: "300px", textAlign: "center",
                      border: `1px solid ${darkMode ? "#333" : "#ddd"}`, boxShadow: "0 4px 10px rgba(0,0,0,0.1)", transition: "all 0.3s ease",
                      position: "relative"
                    }}
                  >
                    <FaAward style={{ fontSize: "2rem", color: "#4facfe", marginBottom: "15px" }} />
                    <h3 style={{ fontSize: "1.2rem", marginBottom: "10px", color: darkMode ? "#fff" : "#333" }}>{cert.title}</h3>
                    <p style={{ fontSize: "0.9rem", color: darkMode ? "#aaa" : "#555" }}>{cert.issuer}</p>
                    <p style={{ fontSize: "0.8rem", color: "#4facfe", marginTop: "10px", fontWeight: "bold" }}>{cert.date}</p>
                    
                    {/* Edit/Delete Buttons for Admin */}
                    {isLoggedIn && (
                      <div className="project-buttons" style={{ marginTop: "15px", justifyContent: "center" }}>
                        <button type="button" className="edit-btn" onClick={() => editCert(cert)}>Edit</button>
                        <button type="button" className="delete-btn" onClick={() => deleteCert(cert._id)}>Delete</button>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </section>

          {isLoggedIn && (
  <section className="project-wrapper" id="admin-projects" style={{ marginTop: "40px" }}>
    <form className="project-form" onSubmit={handleSubmit}>
      <h2 className="section-title">{editId ? "Update Project" : "Add New Project"}</h2>
      
      <div className="form-grid">
        <input type="text" name="title" placeholder="Project Title" value={formData.title} onChange={handleChange} autoComplete="off" className={formData.title ? "filled-box" : ""} />
        <div className="tech-input-container">
          <input type="text" name="technologies" placeholder="Technologies" value={formData.technologies} onChange={handleTechChange} autoComplete="off" className={formData.technologies ? "filled-box" : ""} />
          {showSuggestions && filteredSuggestions.length > 0 && (
            <ul className="suggestions-list">
              {filteredSuggestions.map((tech, i) => (<li key={i} onClick={() => selectSuggestion(tech)}>{tech}</li>))}
            </ul>
          )}
        </div>
        <input type="text" name="githubLink" placeholder="GitHub Link" value={formData.githubLink} onChange={handleChange} autoComplete="off" className={formData.githubLink ? "filled-box" : ""} />
      </div>
      
      {/* Notice there is NO file input here anymore! */}

      <textarea name="description" placeholder="Description" value={formData.description || ""} onChange={handleChange} autoComplete="off" className={formData.description ? "filled-box" : ""} />

      {/* ---> CONSOLIDATED FILE UPLOAD SLOT <--- */}
      <div className="file-upload-container" style={{ width: "100%", marginBottom: "20px", textAlign: "left" }}>
        <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: darkMode ? "#fff" : "#333" }}>Upload Project Thumbnail:</label>
        <input 
  type="file" 
  ref={fileInputRef} 
  accept="image/png, image/jpeg, image/webp" 
  onChange={(e) => setImageFile(e.target.files[0])} 
  className="custom-file-upload" 
/></div>
      {/* -------------------------------- */}

      <div style={{ display: "flex", gap: "15px", width: "100%" }}>
        <button type="submit" style={{ flex: 1 }} disabled={isUploading}>
          {isUploading ? "Uploading Image..." : (editId ? "Update Project" : "Add Project")}
        </button>
        
        {editId && (
          <button type="button" className="cancel-btn" onClick={() => { setEditId(null); setFormData({ title: "", description: "", technologies: "", githubLink: "" }); }}>Cancel Edit</button>
        )}
      </div>
    </form>
  </section>
)}

          <section className="projects-section" id="projects">
  <h2 className="section-title">Projects</h2>
  {projects.length === 0 ? <div className="no-projects">No projects added</div> : (
    <div className="projects-grid">
      {projects.map((project) => (
        <motion.div className="project-card" key={project._id} whileHover={{ y: -8 }}>
          
          {/* ---> NEW IMAGE DISPLAY SLOT <--- */}
          {project.imageUrl && (
            <div className="project-image-container">
              <img src={project.imageUrl} alt={project.title} className="project-thumbnail" />
            </div>
          )}
          {/* --------------------------------- */}

          <div>
            <h3>{project.title}</h3>
            <div className="project-line"></div>
            <p className="project-description">{project.description}</p>
          </div>
          
          <div className="tech-list">
            {project.technologies
    .join(",") 
    .split(",")
    .map((tech, i) => tech.trim() ? <span key={i} className="tech-item">{tech.trim()}</span> : null)
  }
</div>
          
          <div className="project-buttons">
            {project.githubLink && (<a href={project.githubLink} target="_blank" rel="noreferrer"><button type="button" className="github-btn">GitHub</button></a>)}
            {isLoggedIn && (<><button type="button" className="edit-btn" onClick={() => editProject(project)}>Edit</button><button type="button" className="delete-btn" onClick={() => deleteProject(project._id)}>Delete</button></>)}
          </div>
        </motion.div>
      ))}
    </div>
  )}
</section>

          <section className="contact" id="contact">
            <div className="contact-left">
              <h2 className="section-title">Contact Me</h2>
              <div className="email-pill"><FaEnvelope /> shivatejapasunuti@gmail.com</div>
              <div className="contact-socials">
                <a href="https://github.com/pasunutishivateja-git" target="_blank" rel="noreferrer" className="social-link"><FaGithub /> <span>GitHub</span></a>
                <a href="https://www.linkedin.com/in/shiva-teja-pasunuti-961286331/" target="_blank" rel="noreferrer" className="social-link"><FaLinkedin /> <span>LinkedIn</span></a>
                <a href="https://wa.me/9381416738" target="_blank" rel="noreferrer" className="social-link"><FaWhatsapp /> <span>WhatsApp</span></a>
              </div>
            </div>
            <form className="contact-form" onSubmit={sendEmail}>
              <input type="text" name="name" placeholder="Your Name" value={contactData.name} onChange={handleContactChange} required />
              <input type="email" name="email" placeholder="Your Email" value={contactData.email} onChange={handleContactChange} required />
              <textarea name="message" placeholder="Your Message" value={contactData.message} onChange={handleContactChange} required />
              <button type="submit" className="submit-btn">Send Message</button>
            </form>
          </section>

          <footer className="footer">
            <div className="footer-container">
              <div className="footer-left"><h2>Shiva Teja</h2><p>Built with React.js, Node.js, Express.js and MongoDB.</p></div>
              <div className="footer-icons">
                <FaGithub className="footer-logo" /><FaLinkedin className="footer-logo" /><FaWhatsapp className="footer-logo" />
              </div>
            </div>
            <div className="footer-bottom"><p>© 2026 Shiva Teja • All Rights Reserved.</p></div>
          </footer>

        </div>
      } />
    </Routes>
  );
}

export default App;
