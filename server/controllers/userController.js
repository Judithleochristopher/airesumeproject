import User from "../models/User.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import Resume from "../models/Resume.js"

const generateToken=(userId)=>{
    const token=jwt.sign({userId},process.env.JWT_SECRET,{expiresIn:'7d'})
    return token;
}

//controller fro user registration
//POST: /api/users/register
export const registerUser=async(req,res)=>{
    try{
        const{name,email,password}=req.body

        //check if required fields are present
        if(!name||!email||!password){
            return res.status(400).json({message:"missing required fields"})
        }
        //cheack if user already exists
        const user =await User.findOne({email})
        if(user){
            return res.status(400).json({message:"User already exists"})
        }
        //create new user
        const hashedPassword=await bcrypt.hash(password,10)
        const newUser = await User.create({
            name,
            email,
            password:hashedPassword
        })
        //return success message
        const token=generateToken(newUser._id)
        newUser.password=undefined;

        return res.status(201).json({message:"User registered successfully",token,user:newUser})

    }catch(error){
        return res.status(400).json({message:error.message})
    }
}
//controller for user registration
//POST: /api/users/register
// POST: /api/users/login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Missing email or password" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // If your model has a comparePassword method that uses bcrypt.compareSync you can call it,
    // otherwise use bcrypt.compare here:
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user._id);
    user.password = undefined; // hide password
    return res.status(200).json({ message: "Login successful", token, user });
  } catch (error) {
    console.error('loginUser error:', error);
    return res.status(500).json({ message: error.message });
  }
};


//conttroller for getting user by id
//GET: /api/users/:id
export const getUserById=async(req, res)=>{
    try{
        const userId=req.userId;
        const user=await User.findById(id)
        if(!user){
            return res.status(404).json({message:"User not found"})
        }
        user.password=undefined;
        return res.status(200).json({message:"User found", user})
    }catch(error){
        return res.status(400).json({message:error.message})
    }
}

//controller for getting user resumes
//GET: /api/users/resumes
export const getUserResumes=async(req, res)=>{
    try{
        const userId=req.userId;
        const resumes=await Resume.find({userId})
        return res.status(200).json({resumes})
    }catch(error){
        return res.status(400).json({message:error.message})
    }
}
