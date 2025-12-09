import mongoose from "mongoose";

const connectDB = async ()=>{
    try{
        await mongoose.connect(process.env.DB_URI);
        console.log("Database connected successfuly!")
    }catch(err){
        console.error({message: err.message});
    }
}

export default connectDB;