import jwt from "jsonwebtoken";

const generateToken = (userId) => {
    return jwt.sign(
        { id: userId },
        process.env.JWT_SECRET,
        {
            expiresIn: "5d"
        }
    );
};

export default generateToken;