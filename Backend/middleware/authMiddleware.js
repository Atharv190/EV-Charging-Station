import jwt from "jsonwebtoken";
import StationUser from "../models/users.js";


const protect = async (req, res, next) => {
  try {

    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {

      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      );

      req.user = await StationUser.findById(decoded.id).select("-password");

      next();

    } else {

      return res.status(401).json({
        success: false,
        message: "Not Authorized"
      });

    }

  } catch (error) {

    return res.status(401).json({
      success: false,
      message: "Invalid Token"
    });

  }
};

export default protect;