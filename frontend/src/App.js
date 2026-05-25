import {
  FaGithub,
  FaLinkedin,
  FaEnvelope,
  FaMoon,
  FaSun,
} from "react-icons/fa";

import emailjs from "@emailjs/browser";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  // =========================
  // STATES
  // =========================

  const [projects, setProjects] = useState([]);
  const [editId, setEditId] = useState(null);

  const [darkMode, setDarkMode] = useState(true);

  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    technologies: "",
    githubLink: "",
    liveDemo: "",
  });

  const [contactData, setContactData] = useState({
    name: "",
    email: "",
    message: "",
  });

  // =========================
  // USE EFFECT
  // =========================

  useEffect(() => {
    fetchProjects();

    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  // =========================
  // FETCH PROJECTS
  // =========================

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

  // =========================
  // HANDLE FORM CHANGES
  // =========================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // HANDLE CONTACT CHANGES
  // =========================

  const handleContactChange = (e) => {
    setContactData({
      ...contactData,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // SEND EMAIL
  // =========================

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

  // =========================
  // ADD / UPDATE PROJECT
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newProject = {
      ...formData,
      technologies: formData.technologies.split(","),
    };

    try {
      // UPDATE

      if (editId) {
        await axios.put(
          `https://portfolio-backend-2k8z.onrender.com/api/projects/${editId}`,
          newProject
        );

        setEditId(null);
      }

      // ADD

      else {
        await axios.post(
          "https://portfolio-backend-2k8z.onrender.com/api/projects",
          newProject
        );
      }

      fetchProjects();

      setFormData({
        title: "",
        description: "",
        technologies: "",
        githubLink: "",
        liveDemo: "",
      });
    } catch (error) {
      console.log(error);
    }
  };

  // =========================
  // DELETE PROJECT
  // =========================

  const deleteProject = async (id) => {
    try {
      await axios.delete(
        `https://portfolio-backend-2k8z.onrender.com/api/projects/${id}`
      );

      fetchProjects();
    } catch (error) {
      console.log(error);
    }
  };

  // =========================
  // EDIT PROJECT
  // =========================

  const editProject = (project) => {
    setFormData({
      title: project.title,
      description: project.description,
      technologies: project.technologies.join(","),
      githubLink: project.githubLink,
      liveDemo: project.liveDemo,
    });

    setEditId(project._id);
  };

  // =========================
  // LOADER
  // =========================

  if (loading) {
    return (
      <div className="loader">
        <h1>Shiva Teja</h1>
      </div>
    );
  }

  // =========================
  // MAIN RETURN
  // =========================

  return (
    <div className={darkMode ? "app dark" : "app light"}>
      {/* ================= NAVBAR ================= */}

      <nav className="navbar">
        <h2>Shiva Teja</h2>

        <div className="nav-links">
          <a href="#home">Home</a>

          <a href="#about">About</a>

          <a href="#skills">Skills</a>

          <a href="#projects">Projects</a>

          <a href="#contact">Contact</a>
        </div>

        <button
          className="theme-toggle"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>
      </nav>

      {/* ================= HERO SECTION ================= */}

      <motion.section
        className="hero"
        id="home"
        initial={{ opacity: 0, y: 80 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <motion.h1
          className="animated-text"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          Full Stack Developer
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          I build modern and responsive web applications using
          React, Node.js, Express.js, and MongoDB.
        </motion.p>

        <div className="hero-buttons">
          {/* GITHUB */}

          <a
            href="https://github.com/pasunutishivateja-git"
            target="_blank"
            rel="noreferrer"
          >
            <button>
              <FaGithub /> GitHub
            </button>
          </a>

          {/* LINKEDIN */}

          <a
            href="https://www.linkedin.com/in/shiva-teja-pasunuti-961286331/"
            target="_blank"
            rel="noreferrer"
          >
            <button>
              <FaLinkedin /> LinkedIn
            </button>
          </a>
        </div>
      </motion.section>

      {/* ================= ABOUT ================= */}

      <motion.section
        className="about"
        id="about"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h2>About Me</h2>

        <p>
          I am a passionate Full Stack Developer skilled in building
          scalable and modern web applications using the MERN Stack.
          I enjoy creating beautiful UI designs and solving real-world
          problems through technology.
        </p>
      </motion.section>

      {/* ================= SKILLS ================= */}

      <motion.section
        className="skills"
        id="skills"
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h2>Skills</h2>

        <div className="skills-container">
          <div className="skill-card">HTML</div>

          <div className="skill-card">CSS</div>

          <div className="skill-card">JavaScript</div>

          <div className="skill-card">React</div>

          <div className="skill-card">Node.js</div>

          <div className="skill-card">Express.js</div>

          <div className="skill-card">MongoDB</div>

          <div className="skill-card">Python</div>

          <div className="skill-card">GitHub</div>

          <div className="skill-card">REST APIs</div>
        </div>
      </motion.section>

      {/* ================= PROJECT FORM ================= */}

      <motion.form
        className="project-form"
        onSubmit={handleSubmit}
        id="projects"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h2>
          {editId ? "Update Project" : "Add New Project"}
        </h2>

        <input
          type="text"
          name="title"
          placeholder="Project Title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Project Description"
          value={formData.description}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="technologies"
          placeholder="Technologies (comma separated)"
          value={formData.technologies}
          onChange={handleChange}
        />

        <input
          type="text"
          name="githubLink"
          placeholder="GitHub Link"
          value={formData.githubLink}
          onChange={handleChange}
        />

        <input
          type="text"
          name="liveDemo"
          placeholder="Live Demo Link"
          value={formData.liveDemo}
          onChange={handleChange}
        />

        <button type="submit">
          {editId ? "Update Project" : "Add Project"}
        </button>
      </motion.form>

      {/* ================= PROJECTS ================= */}

      <div className="projects-grid">
        {projects.map((project) => (
          <motion.div
            className="project-card"
            key={project._id}
            initial={{ opacity: 0, y: 80 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.03 }}
          >
            <h2>{project.title}</h2>

            <p>{project.description}</p>

            <h4>Technologies</h4>

            <ul className="tech-list">
              {project.technologies.map((tech, i) => (
                <li key={i} className="tech-item">
                  {tech}
                </li>
              ))}
            </ul>

            <div className="links">
              {/* GITHUB */}

              <a
                href={project.githubLink}
                target="_blank"
                rel="noreferrer"
              >
                <button>GitHub</button>
              </a>

              {/* LIVE */}

              <a
                href={project.liveDemo}
                target="_blank"
                rel="noreferrer"
              >
                <button>Live Demo</button>
              </a>

              {/* EDIT */}

              <button onClick={() => editProject(project)}>
                Edit
              </button>

              {/* DELETE */}

              <button onClick={() => deleteProject(project._id)}>
                Delete
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ================= CONTACT ================= */}

      <motion.section
        className="contact"
        id="contact"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="contact-left">
          <h2>Contact Me</h2>

          <p>
            <FaEnvelope />
            shivatejapasunuti@gmail.com
          </p>

          {/* GITHUB */}

          <a
            href="https://github.com/pasunutishivateja-git"
            target="_blank"
            rel="noreferrer"
          >
            <p>
              <FaGithub />
              GitHub Profile
            </p>
          </a>

          {/* LINKEDIN */}

          <a
            href="https://www.linkedin.com/in/shiva-teja-pasunuti-961286331/"
            target="_blank"
            rel="noreferrer"
          >
            <p>
              <FaLinkedin />
              LinkedIn Profile
            </p>
          </a>
        </div>

        {/* CONTACT FORM */}

        <form className="contact-form" onSubmit={sendEmail}>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={contactData.name}
            onChange={handleContactChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={contactData.email}
            onChange={handleContactChange}
            required
          />

          <textarea
            name="message"
            placeholder="Your Message"
            value={contactData.message}
            onChange={handleContactChange}
            required
          />

          <button type="submit">
            Send Message
          </button>
        </form>
      </motion.section>

      {/* ================= FOOTER ================= */}

      <footer className="footer">
        <p>
          © 2026 Shiva Teja. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
}

export default App;