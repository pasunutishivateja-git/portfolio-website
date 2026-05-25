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
  });

  const [contactData, setContactData] = useState({
    name: "",
    email: "",
    message: "",
  });

  // =========================
  // FETCH PROJECTS
  // =========================

  useEffect(() => {

    fetchProjects();

    setTimeout(() => {
      setLoading(false);
    }, 1800);

  }, []);

  const fetchProjects = () => {

    axios
      .get(
        "https://portfolio-backend-2k8z.onrender.com/api/projects"
      )

      .then((res) => {
        setProjects(res.data);
      })

      .catch((err) => {
        console.log(err);
      });
  };

  // =========================
  // HANDLE INPUT CHANGES
  // =========================

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

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

      technologies:
        formData.technologies
          .split(",")
          .map((tech) => tech.trim()),
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
      });

    }

    catch (error) {
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

    }

    catch (error) {
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
      technologies:
        project.technologies.join(", "),
      githubLink: project.githubLink,
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

      {/* ================= HERO ================= */}

      <motion.section
        className="hero"
        id="home"
        initial={{ opacity: 0, y: 80 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >

        <h1 className="animated-text">
          Full Stack Developer
        </h1>

        <p>

          I build modern and responsive
          web applications using React,
          Node.js, Express.js, and MongoDB.

        </p>

        <div className="hero-buttons">

          <a
            href="https://github.com/pasunutishivateja-git"
            target="_blank"
            rel="noreferrer"
          >

            <button>
              <FaGithub />
              GitHub
            </button>

          </a>

          <a
            href="https://www.linkedin.com/in/shiva-teja-pasunuti-961286331/"
            target="_blank"
            rel="noreferrer"
          >

            <button>
              <FaLinkedin />
              LinkedIn
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

        <h2 className="section-title">
          About Me
        </h2>

        <p>

          I am a passionate Full Stack
          Developer skilled in building
          scalable and modern web
          applications using the
          MERN Stack.

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

        <h2 className="section-title">
          Skills
        </h2>

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

        {/* LAYER 1 */}

        <div className="form-layer">

          <h3>

            <span className="layer-number">
              1
            </span>

            Project Title

          </h3>

          <input
            type="text"
            name="title"
            placeholder="Enter project title"
            value={formData.title}
            onChange={handleChange}
            required
          />

        </div>

        {/* LAYER 2 */}

        <div className="form-layer">

          <h3>

            <span className="layer-number">
              2
            </span>

            Project Details

          </h3>

          <div className="form-grid">

            <textarea
              name="description"
              placeholder="Project description"
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
              placeholder="GitHub Repository Link"
              value={formData.githubLink}
              onChange={handleChange}
            />

          </div>

        </div>

        {/* LAYER 3 */}

        <div className="form-layer">

          <h3>

            <span className="layer-number">
              3
            </span>

            {editId
              ? "Update Project"
              : "Add Project"}

          </h3>

          <button type="submit">

            {editId
              ? "Update Project"
              : "Add Project"}

          </button>

        </div>

      </motion.form>

      {/* ================= PROJECTS ================= */}

      <div className="projects-grid">

        {projects.length === 0 ? (

          <h2 className="empty-projects">
            No Projects Added Yet
          </h2>

        ) : (

          projects.map((project) => (

            <motion.div
              className="project-card"
              key={project._id}
              initial={{ opacity: 0, y: 80 }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.7,
              }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
            >

              <h2>{project.title}</h2>

              <p>{project.description}</p>

              <h4>Technologies</h4>

              <ul className="tech-list">

                {project.technologies.map(
                  (tech, i) => (

                    <li
                      key={i}
                      className="tech-item"
                    >

                      {tech}

                    </li>
                  )
                )}

              </ul>

              <div className="links">

                <a
                  href={project.githubLink}
                  target="_blank"
                  rel="noreferrer"
                >

                  <button>
                    GitHub
                  </button>

                </a>

                <button
                  onClick={() =>
                    editProject(project)
                  }
                >

                  Edit

                </button>

                <button
                  onClick={() =>
                    deleteProject(project._id)
                  }
                >

                  Delete

                </button>

              </div>

            </motion.div>
          ))
        )}

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
          >

            <p>

              <FaGithub />

              GitHub Profile

            </p>

          </a>

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

      </motion.section>

      {/* ================= FOOTER ================= */}

      <footer className="footer">

        <p>
          © 2026 Shiva Teja.
          All Rights Reserved.
        </p>

      </footer>

    </div>
  );
}

export default App;