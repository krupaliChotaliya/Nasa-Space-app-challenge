🌍 Real-Time Environmental Monitoring Platform

A web-based platform that leverages NASA’s public APIs to provide real-time global disaster and climate updates. The project integrates robust backend services with a user-friendly interface, enabling seamless access to crucial environmental data.

🚀 Features

Live Environmental Data – Displays real-time disaster and climate updates from NASA APIs.

RESTful API Backend – Built with Node.js & Express.js for high performance and scalability.

Data Management – Uses MongoDB to store and handle large-scale environmental datasets.

Seamless Integration – Fully compatible with responsive front-end applications.

🛠️ Tech Stack

Backend: Node.js, Express.js

Database: MongoDB

API Integration: NASA Public APIs

Architecture: RESTful APIs

📡 How It Works

Fetches live environmental and climate data from NASA’s APIs.

Processes and stores the data in MongoDB for optimized access.

📂 Project Structure
Nasa-Challenge/
│
├── Controller/     # Handles API and data logic
├── Model/          # MongoDB schemas
├── Router/         # Application routes
├── Utils/          # Helper functions
├── images/         # Static images and assets
├── public/         # Publicly accessible files (CSS, JS, etc.)
├── views/          # Handlebars templates
├── app.js          # Main server file
├── package.json    # Dependencies & scripts
└── .env            # Environment variables (NASA API Key, Mongo URI)


Provides RESTful endpoints for easy front-end consumption.

Ensures fast, reliable, and scalable performance.
