import mongoose from "mongoose";

const stationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Station name is required"],
      trim: true,
    },

    // Human-readable location
    location: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
    },

    // Coordinates for map
    latitude: {
      type: Number,
      required: [true, "Latitude is required"],
      min: -90,
      max: 90,
    },

    longitude: {
      type: Number,
      required: [true, "Longitude is required"],
      min: -180,
      max: 180,
    },

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
      required: true,
    },

    powerOutput: {
      type: Number,
      required: [true, "Power output is required"],
      min: 1,
    },

    connectorType: {
      type: String,
      enum: [
        "Type 1",
        "Type 2",
        "CCS",
        "CCS2",
        "CHAdeMO",
        "GB/T",
        "Tesla",
      ],
      required: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StationUser",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Station = mongoose.model("Station", stationSchema);

export default Station;