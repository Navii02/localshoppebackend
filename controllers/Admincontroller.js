 const adminusers= require('../models/Admin')
 const jwt= require('jsonwebtoken')

exports.adminregister=async(req,res)=>{
    const{username,email,password}=req.body
    console.log(req.body);
    
    try{
        const User =await adminusers.findOne({email})
        console.log(User);
        
        if(!User){
            const newUser =new adminusers({
                username,
                email,
                password,
               
                
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
exports.adminlogin = async (req, res) => {
    const { email, password } = req.body;
    console.log(req.body);
    console.log(email, password);

    try {
        const existingUser = await adminusers.findOne({ email: email, password: password });
        if (existingUser) {
            const token = jwt.sign({ userId: existingUser._id }, "secretkey");
            res.status(200).json({ existingUser, token });  // ✅ Correct status code (200)
        } else {
            res.status(406).json({ message: "Incorrect email or password" });  // ✅ 406 for invalid credentials
        }
    } catch (err) {
        console.error("Error in admin login:", err);
        res.status(500).json({ error: "Internal Server Error" });  // ✅ Use 500 for server errors
    }
};
