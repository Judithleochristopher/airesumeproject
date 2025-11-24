import mongoose, { mongo } from "mongoose";

const connectDB = async()=> {
    try{
        mongoose.connection.on("connected",()=>{console.log("Connected to DB")})
        let mongodbURI = process.env.MONGODB_URI;
        const projectName='resume-builder';
        if(!mongodbURI){
            throw new Error("MONGODB_URI is not defined in .env file");
        }
        if(mongodbURI.endsWith("/")){
            mongodbURI = mongodbURI.slice(0,-1);
        }
        await mongoose.connect(`${mongodbURI}/${projectName}`);
    }catch(error){
        console.log(error.message);
    }
}
export default connectDB;