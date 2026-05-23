import {
  FaGithub,
  FaLinkedin,
  FaEnvelope,
  FaMoon,
  FaSun
} from "react-icons/fa";

import emailjs from "@emailjs/browser";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {

  const [projects, setProjects] = useState([]);
  const [editId, setEditId] = useState(null);
  const [darkMode, setDarkMode] = useState(true);

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

  useEffect(() => {
    fetchProjects();
  }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newProject = {
      ...formData,
      technologies: formData.technologies.split(","),
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
        liveDemo: "",
      });

    } catch (error) {
      console.log(error);
    }
  };

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

  return (
    <div className={darkMode ? "app dark" : "app light"}>

      {/* NAVBAR */}

      <nav className="navbar">

        <h2>Shiva Teja</h2>

        <div className="nav-links">
          <a href="#home">Home</a>
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

      {/* HERO SECTION */}

      <motion.div
        className="hero"
        id="home"
        initial={{ opacity: 0, y: 80 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >

        <h1>Full Stack Developer</h1>

        <p>
          I build modern web applications using React, Node.js,
          Express, and MongoDB.
        </p>

        <div className="hero-buttons">

          <a
            href="https://github.com/pasunutishivateja-git"
            target="_blank"
            rel="noreferrer"
          >
            <button>
              <FaGithub /> GitHub
            </button>
          </a>

          <a
            href="https://www.linkedin.com/"
            target="_blank"
            rel="noreferrer"
          >
            <button>
              <FaLinkedin /> LinkedIn
            </button>
          </a>

        </div>

      </motion.div>

      {/* ABOUT */}

      <section className="about">

        <h2>About Me</h2>

        <p>
          I am a passionate Full Stack Developer skilled in
          building modern web applications using React,
          Node.js, Express, and MongoDB.
        </p>

      </section>

      {/* SKILLS */}

      <section className="skills">

        <h2>Skills</h2>

        <div className="skills-container">

          <div className="skill-card">HTML</div>
          <div className="skill-card">CSS</div>
          <div className="skill-card">JavaScript</div>
          <div className="skill-card">React</div>
          <div className="skill-card">Node.js</div>
          <div className="skill-card">Express</div>
          <div className="skill-card">MongoDB</div>
          <div className="skill-card">Python</div>

        </div>

      </section>

     {/* PROJECT FORM */}
     
<form className="project-form" onSubmit={handleSubmit} id="projects">
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
</form>

{/* PROJECT GRID */}
<div className="projects-grid">
  {projects.map((project) => (
    <motion.div className="project-card" key={project._id}>
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
        <a href={project.githubLink} target="_blank">
          <button>GitHub</button>
        </a>

        <a href={project.liveDemo} target="_blank">
          <button>Live</button>
        </a>

        <button onClick={() => editProject(project)}>Edit</button>
        <button onClick={() => deleteProject(project._id)}>Delete</button>
      </div>
    </motion.div>
  ))}
</div>

      {/* CONTACT */}

      <section className="contact" id="contact">

        <div className="contact-left">

          <h2>Contact Me</h2>

          <p>
            <FaEnvelope />
            shivatejapasunuti@gmail.com
          </p>

          <p>
            <FaGithub />
            GitHub Profile
          </p>

          <p>
            <FaLinkedin />
            LinkedIn Profile
          </p>

        </div>

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

      {/* FOOTER */}

      <footer className="footer">

        <p>
          © 2026 Shiva Teja. All Rights Reserved.
        </p>

      </footer>

    </div>
  );
}

export default App;