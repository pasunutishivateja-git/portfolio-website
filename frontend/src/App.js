import profileImage from "./assets/aizen.jpg";
import Login from "./pages/Login";
import {
  Routes,
  Route,
}
from "react-router-dom";
import {
  FaGithub,
  FaLinkedin,
  FaEnvelope,
  FaMoon,
  FaSun,
  FaWhatsapp,
} from "react-icons/fa";

import emailjs from "@emailjs/browser";
import { motion, useScroll, useSpring } from "framer-motion";
import React, { useEffect, useState } from "react";

import axios from "axios";
import "./App.css";

function App() {

  // ================= STATES =================

  const [projects, setProjects] = useState([]);
  const [editId, setEditId] = useState(null);

  const [darkMode, setDarkMode] = useState(true);

  const [loading, setLoading] = useState(true);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // <--- ADD THIS LINE
 
  // ADMIN TOKEN
  const token = localStorage.getItem("token");

// ================= TOGGLE SIDEBAR =================
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    technologies: "",
    githubLink: "",
  });

  const [contactData, setContactData] = useState({
    name: "",
    email: "",
    message: "",
  });

  // ================= THEME EFFECT =================

  useEffect(() => {

    if (darkMode) {
      document.body.classList.remove("light-mode");
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
      document.body.classList.add("light-mode");
    }

  }, [darkMode]);

  // ================= SCROLL BAR =================

  const { scrollYProgress } = useScroll();

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // ================= INITIAL LOAD =================

  useEffect(() => {

    fetchProjects();

    setTimeout(() => {
      setLoading(false);
    }, 1200);

  }, []);

  // ================= FETCH PROJECTS =================

  const fetchProjects = () => {

    axios
      .get("https://portfolio-backend-2k8z.onrender.com/api/projects")

      .then((res) => {
        setProjects(res.data);
      })

      .catch((err) => {
        console.log(err);
      });
  };

  // ================= FORM CHANGE =================

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ================= CONTACT CHANGE =================

  const handleContactChange = (e) => {

    setContactData({
      ...contactData,
      [e.target.name]: e.target.value,
    });
  };

  // ================= SEND EMAIL =================

  const sendEmail = (e) => {

    e.preventDefault();

    emailjs
      .send(
        "service_jcwz5az",
        "template_84bnhae",
        contactData,
        "68PSl9RYGeUNFwyWF"
      )

      .then(() => {

        alert("Message Sent Successfully!");

        setContactData({
          name: "",
          email: "",
          message: "",
        });
      })

      .catch((error) => {
        console.log(error);
      });
  };

  // ================= SUBMIT PROJECT =================

  const handleSubmit = async (e) => {

    e.preventDefault();

    const newProject = {
      ...formData,
      technologies: formData.technologies
        .split(",")
        .map((tech) => tech.trim()),
    };

    try {

      if (editId) {

        await axios.put(
          `https://portfolio-backend-2k8z.onrender.com/api/projects/${editId}`,
          newProject,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setEditId(null);

      } else {

        await axios.post(
          "https://portfolio-backend-2k8z.onrender.com/api/projects",
          newProject,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      fetchProjects();

      setFormData({
        title: "",
        description: "",
        technologies: "",
        githubLink: "",
      });

    } catch(error) {
      console.log(error);
    }
  };

  // ================= DELETE =================

  const deleteProject = async (id) => {

    try {

      await axios.delete(
        `https://portfolio-backend-2k8z.onrender.com/api/projects/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchProjects();

    } catch (error) {
      console.log(error);
    }
  };

  // ================= EDIT =================

  const editProject = (project) => {

    setFormData({
      title: project.title,
      description: project.description,
      technologies: project.technologies.join(", "),
      githubLink: project.githubLink,
    });

    setEditId(project._id);

    window.scrollTo({
      top: 700,
      behavior: "smooth",
    });
  };

  // ================= LOADER =================

  if (loading) {
  return (
    <div className="loader">
      <h1>Shiva Teja</h1>
    </div>
  );
}
//========================MAIN========================//
const isAdmin = localStorage.getItem("token");

return (
  <Routes>
    {/* ================= MAIN PORTFOLIO ================= */}
    <Route
      path="/"
      element={
        <div className={`app ${darkMode ? "dark" : "light"}`}>
          {/* SCROLL BAR */}
          <motion.div className="scroll-progress" style={{ scaleX }} />

          {/* ================= NAVBAR ================= */}
          <nav className="navbar">
            <h2 className="logo">Shiva Teja</h2>
            <div className="nav-links">
              <a href="#home">Home</a>
              <a href="#about">About</a>
              <a href="#education">Education</a>
              <a href="#skills">Skills</a>
              <a href="#projects">Projects</a>
              <a href="#contact">Contact</a>
            </div>

            <div className="nav-controls">
              <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
                {darkMode ? <FaSun /> : <FaMoon />}
              </button>

              {/* The Hamburger Icon */}
              <div className="hamburger" onClick={toggleSidebar}>
                <div className="line"></div>
                <div className="line"></div>
                <div className="line"></div>
              </div>
            </div>
          </nav>

          {/* ================= SIDEBAR & OVERLAY ================= */}
          {/* Dark Overlay (clicks outside sidebar close it) */}
          <div 
            className={`sidebar-overlay ${isSidebarOpen ? "active" : ""}`} 
            onClick={toggleSidebar}
          ></div>

          {/* The Sidebar Menu */}
          <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
            <div className="sidebar-header">
              <h3>Admin Panel</h3>
              <button className="close-btn" onClick={toggleSidebar}>&times;</button>
            </div>
            
            <div className="sidebar-content">
              {isAdmin ? (
                <button 
                  className="sidebar-action-btn logout" 
                  onClick={() => { localStorage.removeItem("token"); window.location.reload(); }}
                >
                  Logout
                </button>
              ) : (
                <a href="/admin-login" style={{ textDecoration: 'none' }}>
                  <button className="sidebar-action-btn login">
                    Admin Login
                  </button>
                </a>
              )}
            </div>
          </div>

          {/* ================= HERO ================= */}
          <motion.section 
            className="hero" id="home" 
            initial={{ opacity: 0, y: 70 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}
          >
            <motion.h1 className="animated-text" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
              Full Stack Developer
            </motion.h1>
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

          {/* ================= ABOUT ================= */}
          <section className="about" id="about">
            <h2 className="section-title">About Me</h2>
            <p>I am a passionate MERN Stack Developer skilled in creating beautiful, modern and scalable web applications.</p>
          </section>

{/* ================= EDUCATION (TIMELINE) ================= */}
          <section className="education" id="education">
            <h2 className="section-title">Education</h2>
            <div className="timeline">
              
              {/* Timeline Item 1: B.Tech */}
              <div className="timeline-item">
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <h3>B.Tech in Computer Science Engineering(AI&ML)</h3>
                  <p className="timeline-date">2023 - 2027</p>
                  <p>Vaagdevi Engineering College</p>
                  <p className="timeline-grade">CGPA: 6.9</p>
                </div>
              </div>

              {/* Timeline Item 2: Intermediate */}
              <div className="timeline-item">
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <h3>Intermediate (Class XII)</h3>
                  <p className="timeline-date">2021 - 2023</p>
                  <p>Vidwan Junior College</p>
                  <p className="timeline-grade">Percentage: 87%</p>
                </div>
              </div>

              {/* Timeline Item 3: High School (Optional, delete if you don't want it) */}
              <div className="timeline-item">
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <h3>High School (Class X)</h3>
                  <p className="timeline-date">2021</p>
                  <p>Froebel Model High School </p>
                  <p className="timeline-grade">CGPA: 10</p>
                </div>
              </div>

            </div>
          </section>

          {/* ================= SKILLS ================= */}
          <section className="skills" id="skills">
            <h2 className="section-title">Skills</h2>
            <div className="skills-container">
              {["HTML", "CSS", "JavaScript", "React", "Node.js", "Python"].map((skill, index) => (
                <motion.div key={index} className="skill-card" whileHover={{ scale: 1.08 }}>{skill}</motion.div>
              ))}
            </div>
          </section>

          {/* ================= PROJECT FORM (ADMIN ONLY) ================= */}
          {isAdmin && (
            <section className="project-wrapper" id="projects">
              <form className="project-form" onSubmit={handleSubmit}>
                <h2 className="section-title">{editId ? "Update Project" : "Add New Project"}</h2>
                <div className="form-grid">
                  <input type="text" name="title" placeholder="Project Title" value={formData.title} onChange={handleChange} required />
                  <input type="text" name="technologies" placeholder="Technologies" value={formData.technologies} onChange={handleChange} />
                  <input type="text" name="githubLink" placeholder="GitHub Link" value={formData.githubLink} onChange={handleChange} />
                </div>
                <textarea name="description" placeholder="Project Description" value={formData.description} onChange={handleChange} required />
                <button type="submit">{editId ? "Update Project" : "Add Project"}</button>
              </form>
            </section>
          )}

          {/* ================= PROJECTS LIST ================= */}
          <section className="projects-section">
            {projects.length === 0 ? (
              <div className="no-projects">No projects added</div>
            ) : (
              <div className="projects-grid">
                {projects.map((project) => (
                  <motion.div className="project-card" key={project._id} whileHover={{ y: -8 }}>
                    <div>
                      <h3>{project.title}</h3>
                      <div className="project-line"></div>
                      <p className="project-description">{project.description}</p>
                    </div>
                    <div className="tech-list">
                      {project.technologies.map((tech, i) => (
                        <span key={i} className="tech-item">{tech}</span>
                      ))}
                    </div>
                    <div className="project-buttons">
                      <a href={project.githubLink} target="_blank" rel="noreferrer">
                        <button type="button" className="github-btn">GitHub</button>
                      </a>
                      {isAdmin && (
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

          {/* ================= CONTACT ================= */}
          <section className="contact" id="contact">
            <div className="contact-left">
              <h2 className="section-title">Contact Me</h2>
              <div className="email-pill">
                <FaEnvelope /> shivatejapasunuti@gmail.com
              </div>

              {/* --- NEW SOCIAL LINKS --- */}
                  <div className="contact-socials">
                    <a href="https://github.com/pasunutishivateja-git" target="_blank" rel="noreferrer" className="social-link">
                      <FaGithub /> <span>GitHub</span>
                    </a>
                    <a href="https://www.linkedin.com/in/shiva-teja-pasunuti-961286331/" target="_blank" rel="noreferrer" className="social-link">
                      <FaLinkedin /> <span>LinkedIn</span>
                    </a>
                    {/* Make sure to add your actual phone number below! */}
                    <a href="https://wa.me/9381416738" target="_blank" rel="noreferrer" className="social-link">
                      <FaWhatsapp /> <span>WhatsApp</span>
                    </a>
                  </div>
            </div>

            <form className="contact-form" onSubmit={sendEmail}>
              <input type="text" name="name" placeholder="Your Name" value={contactData.name} onChange={handleContactChange} required />
              <input type="email" name="email" placeholder="Your Email" value={contactData.email} onChange={handleContactChange} required />
              <textarea name="message" placeholder="Your Message" value={contactData.message} onChange={handleContactChange} required />
              <button type="submit" className="submit-btn">Send Message</button>
            </form>
          </section>

          {/* ================= FOOTER ================= */}
      <footer className="footer">
        <div className="footer-container">
          
          {/* Left Side: Name and Tech Stack */}
          <div className="footer-left">
            <h2>Shiva Teja</h2>
            <p>Built with React.js, Node.js, Express.js and MongoDB.</p>
          </div>
          
          {/* Right Side: Circular Hover Icons */}
          <div className="footer-icons">
            <a href="https://github.com/pasunutishivateja-git" target="_blank" rel="noreferrer">
              <FaGithub />
            </a>
            <a href="https://www.linkedin.com/in/shiva-teja-pasunuti-961286331/" target="_blank" rel="noreferrer">
              <FaLinkedin />
            </a>
            <a href="https://wa.me/9381416738" target="_blank" rel="noreferrer">
              <FaWhatsapp />
            </a>
          </div>

        </div>

        {/* Bottom: Copyright */}
        <div className="footer-bottom">
          <p>© 2026 Shiva Teja • All Rights Reserved.</p>
        </div>
      </footer>
        </div>
      }
    />
    <Route path="/admin-login" element={<Login />} />
  </Routes>
);
}
export default App;