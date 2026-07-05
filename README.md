# VoltGrid

VoltGrid is a full-stack EV Charging Station Management System built using React, Node.js, Express, and MongoDB. It allows users to manage EV charging stations, authenticate securely, and view charging stations on an interactive map.

## Features

- User Registration & Login (JWT Authentication)
- Add, Update and Delete Charging Stations
- View All Charging Stations
- View Your Own Stations
- Search and Filter Stations
- Interactive Map using OpenStreetMap
- Responsive User Interface

## Tech Stack

### Frontend
- React.js
- Axios
- React Leaflet
- Tailwind CSS

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication

## Project Structure
VoltGrid
│
├── Backend
└── Frontend
└── Postman

## Getting Started

### 1. Clone the Repository
git clone https://github.com/YOUR_USERNAME/VoltGrid.git
cd VoltGrid

---

## Backend Setup
Go to the backend folder.
cd Backend
npm install

# Create a `.env` file inside the **Backend** folder.
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret_key
FRONTEND_URL=http://localhost:5173

# Start the backend server.
npm run dev

# Backend will run on:
http://localhost:5000

---

## Frontend Setup

Open a new terminal.

cd Frontend
npm install

# Create a `.env` file inside the **Frontend** folder.
VITE_API_URL=http://localhost:5000/api

# Start the frontend.
npm run dev

#Frontend will run on:
http://localhost:5173

---

## API Endpoints

## Authentication

| Method | Endpoint |
|---------|----------|
| POST | /api/auth/register |
| POST | /api/auth/login |

### Charging Stations

| Method | Endpoint |
|---------|----------|
| GET | /api/stations |
| GET | /api/stations/:id |
| POST | /api/stations |
| PUT | /api/stations/:id |
| DELETE | /api/stations/:id |
| GET | /api/stations/my |

---

## Deployment

# Frontend:
https://ev-charging-station-voltgrid.vercel.app

# Backend:
https://ev-charging-station-sw2c.onrender.com

## Author

Atharv Marathe
