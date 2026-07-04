import Station from "../models/station.js";

export const createStation = async (req, res) => {
  try {
    const {
      name,
      location,
      latitude,
      longitude,
      status,
      powerOutput,
      connectorType,
    } = req.body;

    const station = await Station.create({
      name,
      location,
      latitude,
      longitude,
      status,
      powerOutput,
      connectorType,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Charging station created successfully.",
      station,
    });
  } 
  catch (error)
   {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const getAllStations = async (req, res) => {
  try {
    const { status, connectorType, powerOutput, search } = req.query;

    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (connectorType) {
      filter.connectorType = connectorType;
    }

    if (powerOutput) {
      filter.powerOutput = Number(powerOutput);
    }

    if (search) {
      filter.name = {
        $regex: search,
        $options: "i",
      };
    }

    const stations = await Station.find(filter)
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      totalStations: stations.length,
      stations,
    });
  } 
  catch (error)
   {
    console.error("Error fetching stations:", error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getStationById = async (req, res) => {
  try {
    const station = await Station.findById(req.params.id).populate(
      "createdBy",
      "name email"
    );

    if (!station) {
      return res.status(404).json({
        success: false,
        message: "Charging station not found.",
      });
    }

    res.status(200).json({
      success: true,
      station,
    });
  } 
  catch (error)
   {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateStation = async (req, res) => {
  try {
    const station = await Station.findById(req.params.id);

    if (!station) {
      return res.status(404).json({
        success: false,
        message: "Charging station not found.",
      });
    }

    if (station.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this station.",
      });
    }

    const updatedStation = await Station.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Charging station updated successfully.",
      station: updatedStation,
    });

  }
   catch (error) 
   {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const deleteStation = async (req, res) => {
  try {
    const station = await Station.findById(req.params.id);

    if (!station) {
      return res.status(404).json({
        success: false,
        message: "Charging station not found.",
      });
    }

    if (station.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this station.",
      });
    }

    await station.deleteOne();

    res.status(200).json({
      success: true,
      message: "Charging station deleted successfully.",
    });
  } 
  catch (error)
   {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMyStations = async (req, res) => {
  try {

    const stations = await Station.find({
      createdBy: req.user._id,
    })
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      totalStations: stations.length,
      stations,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};