import {
  FaGithub,
  FaLinkedin,
  FaEnvelope,
  FaMoon,
  FaSun,
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
          newProject
        );

        setEditId(null);

      } else {

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
      });

    } catch (error) {
      console.log(error);
    }
  };

  // ================= DELETE =================

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

  // ================= MAIN =================

  return (

   <div className={`app ${darkMode ? "dark" : "light"}`}>

      {/* SCROLL BAR */}

      <motion.div
        className="scroll-progress"
        style={{ scaleX }}
      />

      {/* ================= NAVBAR ================= */}

      <nav className="navbar">

        <h2 className="logo">
          Shiva Teja
        </h2>

        <div className="nav-links">

          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#skills">Skills</a>
          <a href="#projects">Projects</a>
          <a href="#contact">Contact</a>

        </div>

        {/* THEME BUTTON */}

        <button
          className="theme-toggle"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>

      </nav>

      {/* ================= HERO ================= */}

      <motion.section
        className="hero"
        id="home"
        initial={{ opacity: 0, y: 70 }}
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
          I build modern, scalable and responsive web applications
          using React.js, Node.js, Express.js and MongoDB.
        </motion.p>

        {/* HERO BUTTONS */}

        <div className="hero-buttons">

          <a
            href="https://github.com/pasunutishivateja-git"
            target="_blank"
            rel="noreferrer"
            className="hero-link"
          >
            <div className="hero-btn">
              <FaGithub />
              <span>GitHub</span>
            </div>
          </a>

          <a
            href="https://www.linkedin.com/in/shiva-teja-pasunuti-961286331/"
            target="_blank"
            rel="noreferrer"
            className="hero-link"
          >
            <div className="hero-btn">
              <FaLinkedin />
              <span>LinkedIn</span>
            </div>
          </a>

        </div>

      </motion.section>

      {/* ================= ABOUT ================= */}

      <section className="about" id="about">

        <h2 className="section-title">
          About Me
        </h2>

        <p>
          I am a passionate MERN Stack Developer skilled in
          creating beautiful, modern and scalable web applications.
          I enjoy solving real-world problems through technology
          and building professional user experiences.
        </p>

      </section>

      {/* ================= SKILLS ================= */}

      <section className="skills" id="skills">

        <h2 className="section-title">
          Skills
        </h2>

        <div className="skills-container">

          {[
            "HTML",
            "CSS",
            "JavaScript",
            "React",
            "Node.js",
            "Python",
          ].map((skill, index) => (

            <motion.div
              key={index}
              className="skill-card"
              whileHover={{ scale: 1.08 }}
            >
              {skill}
            </motion.div>

          ))}

        </div>

      </section>

      {/* ================= PROJECT FORM ================= */}

      <section className="project-wrapper" id="projects">

        <form
          className="project-form"
          onSubmit={handleSubmit}
        >

          <h2 className="section-title">
            {editId ? "Update Project" : "Add New Project"}
          </h2>

          <div className="form-grid">

            <input
              type="text"
              name="title"
              placeholder="Project Title"
              value={formData.title}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="technologies"
              placeholder="Technologies (React, Node.js)"
              value={formData.technologies}
              onChange={handleChange}
            />

            <input
              type="text"
              name="githubLink"
              placeholder="GitHub Repository Link"
              value={formData.githubLink}
              onChange={handleChange}
            />

          </div>

          <textarea
            name="description"
            placeholder="Project Description"
            value={formData.description}
            onChange={handleChange}
            required
          />

          <button type="submit">
            {editId ? "Update Project" : "Add Project"}
          </button>

        </form>

      </section>

      {/* ================= PROJECTS ================= */}

      <section className="projects-section">
{projects.length === 0 ? (
   <div className="no-projects">
      No project added
      </div>
        ) : (
        <div className="projects-grid">

          {projects.map((project) => (

            <motion.div
              className="project-card"
              key={project._id}
              whileHover={{ y: -8 }}
            >

              <div>

                <h3>{project.title}</h3>

                <div className="project-line"></div>

                <p className="project-description">
                  {project.description}
                </p>

              </div>

              <div>

                <div className="tech-list">

                  {project.technologies.map((tech, i) => (

                    <span
                      key={i}
                      className="tech-item"
                    >
                      {tech}
                    </span>

                  ))}

                </div>

                <div className="project-buttons">

                  <a
                    href={project.githubLink}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <button
                      type="button"
                      className="github-btn"
                    >
                      GitHub
                    </button>
                  </a>

                  <button
                    type="button"
                    className="edit-btn"
                    onClick={() => editProject(project)}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    className="delete-btn"
                    onClick={() => deleteProject(project._id)}
                  >
                    Delete
                  </button>

                </div>

              </div>

            </motion.div>

          ))}

        </div>
        )}

      </section>

      {/* ================= CONTACT ================= */}

      <section className="contact" id="contact">

        <div className="contact-left">

          <h2 className="section-title">
            Contact Me
          </h2>

          <p>
            <FaEnvelope />
            shivatejapasunuti@gmail.com
          </p>

          <a
            href="https://github.com/pasunutishivateja-git"
            target="_blank"
            rel="noreferrer"
            className="contact-link"
          >
            <FaGithub />
            GitHub Profile
          </a>

          <a
            href="https://www.linkedin.com/in/shiva-teja-pasunuti-961286331/"
            target="_blank"
            rel="noreferrer"
            className="contact-link"
          >
            <FaLinkedin />
            LinkedIn Profile
          </a>

        </div>

        {/* CONTACT FORM */}

        <form
          className="contact-form"
          onSubmit={sendEmail}
        >

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

      </section>

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