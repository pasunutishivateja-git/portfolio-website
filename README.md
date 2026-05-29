# 🚀 Shiva Teja | Full Stack Developer Portfolio

Welcome to the repository for my personal portfolio website! This is a complete **Full-Stack MERN** application designed to showcase my projects, skills, and experience, complete with a custom backend content management system.

🔗 **[View Live Site Here](https://portfolio-website-alpha-swart-78.vercel.app/)**

---

## ✨ Key Features

* **Custom Admin Dashboard:** A secure, token-based authentication system allowing me to add, edit, and delete projects directly from the live UI without touching the code.
* **Full-Stack Architecture:** RESTful API built with Node.js/Express, connected to a MongoDB database to dynamically serve project data.
* **Dynamic Theming:** Seamless Dark/Light mode toggle with `localStorage` persistence.
* **Fully Responsive UI:** Custom CSS media queries ensuring a flawless experience on desktop, tablet, and mobile (featuring a custom sliding mobile drawer).
* **Live Contact Form:** Integrated with EmailJS to send messages directly to my inbox without requiring a third-party email client.

---

## 🛠️ Tech Stack

**Frontend:**
* React.js
* Framer Motion (Animations)
* Axios (API Requests)
* Vanilla CSS (Flexbox, Grid, Custom Variables)

**Backend:**
* Node.js & Express.js
* MongoDB & Mongoose (Database)
* JSON Web Tokens (JWT Authentication)

**Deployment:**
* Vercel (Frontend)
* Render (Backend API)

---

## 💻 Running Locally

If you want to run this project on your own machine, follow these steps:

**1. Clone the repository:**
\`\`\`bash
git clone https://github.com/pasunutishivateja-git/portfolio-website.git
\`\`\`

**2. Install Dependencies:**
Navigate into both the frontend and backend folders and run:
\`\`\`bash
npm install
\`\`\`

**3. Environment Variables:**
Create a `.env` file in the backend directory with the following:
\`\`\`env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_custom_secret_key
PORT=5000
\`\`\`

**4. Start the Servers:**
Run `npm start` in the backend folder, and `npm start` in the frontend folder.