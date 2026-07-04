import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async ()=> {
    try
    {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log("Database Connected For The Ev-Charging Staion...!!");
    }
    catch(err)
    {
        console.log("Error...!!",err);
    }
}

export default connectDB; 