import StationUser from "../models/users.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";

export const register = async (req, res) => {
    try {

        const { name, email, password } = req.body;

        const userExists = await StationUser.findOne({ email });

        if(userExists){
            return res.status(400).json({
                message:"Email already exists....!!"
            });
        }

        const hashedPassword = await bcrypt.hash(password,10);

        const user = await StationUser.create({
            name,
            email,
            password:hashedPassword
        });

        res.status(201).json({
            success:true,
            message:"User Registered Successfully"
        });
    } 
    
    catch (error)
    {
        console.log(error);
    }
};

export const login = async (req,res) => {
    try {

        const { email, password } = req.body;

        const user = await StationUser.findOne({ email });

        if(!user){
            return res.status(400).json({
                message:"Invalid Email"
            });
        }

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if(!isMatch){
            return res.status(400).json({
                message:"Invalid Password...!!Enter Correct Password"
            });
        }

        const token = generateToken(user._id);

        res.status(200).json({
            success:true,
            message:"Login Successful...!!",
            token,
            user
        });

    } 
    
    catch (error) 
    {
        console.log(error);
    }
};