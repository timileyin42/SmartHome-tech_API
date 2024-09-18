# Smart Home Automation System

## Overview

The Smart Home Automation System is a full-stack application designed to control and monitor various smart devices within a home environment. It provides a centralized interface for managing devices, setting up automation rules, and ensuring secure access to users.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgments](#acknowledgments)

## Features

- **Frontend:**
  - User interface built with React.
  - Device control and status monitoring.
  - Automation rules configuration.
  - Integration with backend services for real-time updates.

- **Backend:**
  - RESTful API built with Node.js and Express.
  - Secure user authentication using JWT.
  - CRUD operations for device management and automation rules.
  - Error handling and logging.

- **Database:**
  - MongoDB for storing user data, device information, and automation rules.

## Technologies Used

- **Frontend:**
  - React
  - Webpack
  - Babel
  - CSS/SCSS

- **Backend:**
  - Node.js
  - Express
  - MongoDB
  - JWT (JSON Web Tokens)
  - CORS

- **Deployment:**
  - Vercel (for backend deployment)
  - Web server (for frontend deployment)
  - MongoDB Atlas (for database hosting)

## Project Structure

SmartHome-tech_API/ ├── dist/ # Compiled backend code ├── node_modules/ # Node.js modules ├── src/ # Source code for backend │ ├── config/ # Database connection configuration │ ├── middleware/ # Custom middleware │ ├── models/ # Database models │ ├── routes/ # API routes │ ├── utils/ # Utility functions │ └── app.ts # Main application file ├── tests/ # Test cases for backend (optional) ├── package.json # Backend project dependencies and scripts ├── tsconfig.json # TypeScript configuration ├── .env # Environment variables (exclude from version control) └── README.md # Project documentation


## Setup Instructions

### Backend

1. **Clone the repository:**
   ```bash
   git clone [repository-url]

   **cd SmartHome-tech_API

   **npm install

   Create a .env file:

   ```bash
   MONGODB_URI=
   PORT=3000
   JWT_SECRET=<your-jwt-secret>
   OPENWEATHERMAP_API_KEY=<your-api-key>

   ```bash
   npm run build
   npm start

   **Frontend
   cd SmartHome-tech_API-Frontend
   

   
### SmartHome-tech_API-Frontend/

 
SmartHome-tech_API-Frontend/ ├── public/ # Static files for frontend ├── src/ # Source code for frontend │ ├── components/ # React components │ ├── hooks/ # Custom hooks │ ├── pages/ # React pages/views │ └── App.tsx # Main React component ├── package.json # Frontend project dependencies and scripts ├── tsconfig.json # TypeScript configuration └── README.md # Project documentation


