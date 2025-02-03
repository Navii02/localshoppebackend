const Users = require("../models/Users")
const jwt= require('jsonwebtoken')

exports.userregister=async(req,res)=>{
    const{username,email,password}=req.body
    console.log(req.body);
    
    try{
        const User =await Users.findOne({email})
        console.log(User);
        
        if(!User){
            const newUser =new Users({
                username,
                email,
                password,
                mobileNo:"",
                
            })
            await newUser.save()
                       res.status(200).json({newUser})
        }
        else{
            res.status(406).json("User Already Exists")
          
        }
    }catch(err){
        res.status(401).json("Something Went wrong")
    }
 
}
exports.UserLogin=async (req,res) => {
    const {email,password} = req.body
    console.log(req.body);
    
    try{
        const existingUser=await Users.findOne({email,password})
        if(existingUser){
            const token=jwt.sign({userId:existingUser._id},"secretkey")
            res.status(200).json({existingUser,token})

        }
        else{
            res.status(406).json("incorect email or password")
        }

        }

    catch(err){
        res.status().json(err)
    }
}
exports.saveLocation =async(req,res)=>{
    try {
        const userId = req.payload;
        console.log(userId);
         
        const { lat, lon, address } = req.body;
        //console.log(req.body);
       
        const user = await Users.findByIdAndUpdate(
          userId,
          { location: { lat, lon, address } },
          { new: true }
        );
    
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
    
        res.json({ message: "Location updated successfully", user });
      } catch (error) {
        res.status(500).json({ message: "Server error", error });
      }
    
}
exports.UserDetails=async(req, res)=>{
    userId=req.payload
    console.log(userId);
    const user =await Users.findById({_id:userId})
    res.status(200).json(user);
    
}