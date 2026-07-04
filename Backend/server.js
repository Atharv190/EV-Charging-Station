import authRoutes from "./routes/authRoutes.js";
import stationRoutes from "./routes/stationRoutes.js";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";


dotenv.config();


const app = express();

connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/stations", stationRoutes);


// Test Route
app.get("/", (req, res) => {
    res.send("🚀 EV Charging Station API is Running...");
});

// Port
const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});