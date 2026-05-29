import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { motion, useScroll, useSpring } from "framer-motion";
import axios from "axios";
import emailjs from "@emailjs/browser";

// --- Assets & Icons ---
import profileImage from "./assets/aizen.jpg";
import { FaGithub, FaLinkedin, FaEnvelope, FaMoon, FaSun, FaWhatsapp } from "react-icons/fa";
import "./App.css";

// --- Components ---
import Login from "./pages/Login";

function App() {
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(() => {
  // Check if they saved a theme before. If not, default to dark mode (true)
  const savedTheme = localStorage.getItem("portfolio-theme");
  return savedTheme === "light" ? false : true;
});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const token = localStorage.getItem("token");
  const [projects, setProjects] = useState([]);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    title: "", description: "", technologies: "", githubLink: "",
  });
  const [savedTech, setSavedTech] = useState([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [contactData, setContactData] = useState({
    name: "", email: "", message: "",
  });

  const navigate = useNavigate();

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
    localStorage.setItem("portfolio-theme", "dark"); // <-- Saves Dark Mode
  } else {
    document.body.classList.remove("dark-mode");
    document.body.classList.add("light-mode");
    localStorage.setItem("portfolio-theme", "light"); // <-- Saves Light Mode
  }
}, [darkMode]);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const updateSuggestions = (newTechString) => {
    if (!newTechString) return;
    const updatedList = [...new Set([...savedTech, newTechString])];
    setSavedTech(updatedList);
    localStorage.setItem("myTechSuggestions", JSON.stringify(updatedList));
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleContactChange = (e) => setContactData({ ...contactData, [e.target.name]: e.target.value });

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newProject = {
      ...formData,
      technologies: formData.technologies.split(",").map((tech) => tech.trim()),
    };
    updateSuggestions(formData.technologies);
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      if (editId) {
        await axios.put(`https://portfolio-backend-2k8z.onrender.com/api/projects/${editId}`, newProject, config);
        setEditId(null);
      } else {
        await axios.post("https://portfolio-backend-2k8z.onrender.com/api/projects", newProject, config);
      }
      fetchProjects();
      setFormData({ title: "", description: "", technologies: "", githubLink: "" });
    } catch (error) { console.error(error); }
  };

  const deleteProject = async (id) => {
    try {
      await axios.delete(`https://portfolio-backend-2k8z.onrender.com/api/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
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
    window.scrollTo({ top: 700, behavior: "smooth" });
  };

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

          {/* =========================================
              SIDEBAR & OVERLAY SECTION
              ========================================= */}
          <div className={`sidebar-overlay ${isSidebarOpen ? "active" : ""}`} onClick={toggleSidebar}></div>
          <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
            <div className="sidebar-header">
              <h3>Admin</h3>
              <button className="close-btn" onClick={toggleSidebar}>&times;</button>
            </div>
            <div className="sidebar-content">
              {isLoggedIn ? (
                <button 
                  className="sidebar-action-btn logout" 
                  onClick={() => { 
                    localStorage.removeItem("token"); 
                    setIsLoggedIn(false); 
                    window.location.reload(); 
                  }}
                >
                  Logout
                </button>
              ) : (
                <button 
                  className="sidebar-action-btn login" 
                  onClick={() => {
                    toggleSidebar();          // <-- Closes the mobile menu
                    navigate("/login");       // <-- Instantly routes to the login page
                  }}
                >
                  Admin Login
                </button>
              )}
            </div>
          </div>
          {/* ========================================= */}
          {/* The rest of your site starts here... */}
          <motion.section className="hero" id="home" initial={{ opacity: 0, y: 70 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
            <motion.h1 className="animated-text" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>Full Stack Developer</motion.h1>
            <motion.div className="hero-avatar" animate={{ y: [0, -15, 0] }} transition={{ duration: 4, repeat: Infinity }}>
              <img src={profileImage} alt="Profile" />
            </motion.div>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
              I build modern, scalable and responsive web applications using React.js, Node.js, Express.js and MongoDB.
            </motion.p>
            <div className="hero-buttons">
              <a href="https://github.com/pasunutishivateja-git" target="_blank" rel="noreferrer" className="hero-link">
                <div className="hero-btn"><FaGithub /><span>GitHub</span></div>
              </a>
              <a href="https://www.linkedin.com/in/shiva-teja-pasunuti-961286331/" target="_blank" rel="noreferrer" className="hero-link">
                <div className="hero-btn"><FaLinkedin /><span>LinkedIn</span></div>
              </a>
            </div>
          </motion.section>

          <section className="about" id="about">
            <h2 className="section-title">About Me</h2>
            <p>I am a passionate MERN Stack Developer skilled in creating beautiful, modern and scalable web applications.</p>
          </section>

          <section className="education" id="education">
            <h2 className="section-title">Education</h2>
            <div className="timeline">
              <div className="timeline-item"><div className="timeline-dot"></div><div className="timeline-content"><h3>B.Tech in Computer Science Engineering (AI&ML)</h3><p className="timeline-date">2023 - 2027</p><p>Vaagdevi Engineering College</p><p className="timeline-grade">CGPA: 6.9</p></div></div>
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

          {isLoggedIn && (
            <section className="project-wrapper" id="projects">
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
                <textarea name="description" placeholder="Description" value={formData.description || ""} onChange={handleChange} autoComplete="off" className={formData.description ? "filled-box" : ""} />
                <button type="submit">{editId ? "Update Project" : "Add Project"}</button>
              </form>
            </section>
          )}

          <section className="projects-section">
            {projects.length === 0 ? <div className="no-projects">No projects added</div> : (
              <div className="projects-grid">
                {projects.map((project) => (
                  <motion.div className="project-card" key={project._id} whileHover={{ y: -8 }}>
                    <div>
                      <h3>{project.title}</h3><div className="project-line"></div><p className="project-description">{project.description}</p>
                    </div>
                    <div className="tech-list">{project.technologies.map((tech, i) => <span key={i} className="tech-item">{tech}</span>)}</div>
                    <div className="project-buttons">
  {/* THE FIX: We wrap the link in a conditional check */}
  {project.githubLink && (
    <a href={project.githubLink} target="_blank" rel="noreferrer">
      <button type="button" className="github-btn">GitHub</button>
    </a>
  )}
  {isLoggedIn && (
    <>
      <button type="button" className="edit-btn" onClick={() => editProject(project)}>Edit</button>
      <button type="button" className="delete-btn" onClick={() => deleteProject(project._id)}>Delete</button>
    </>
  )}
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