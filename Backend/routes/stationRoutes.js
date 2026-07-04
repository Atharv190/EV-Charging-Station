import express from "express";
import {
  createStation,
  getAllStations,
  getStationById,
  updateStation,
  deleteStation,
  getMyStations
} from "../controllers/stationController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createStation);
router.get("/", protect, getAllStations);
router.get("/my", protect, getMyStations);
router.get("/:id", protect, getStationById);
router.put("/:id", protect, updateStation);
router.delete("/:id", protect, deleteStation);


export default router;