const BusinessUsers = require('../models/BusinessUser')
const jwt= require('jsonwebtoken')
const NormalUsers = require('../models/Users')
exports.Businessregister= async(req,res)=>{

   
    
    //console.log(req.body);
    
    const{username,businessname,email,password} = req.body
    //console.log(businessname,username,email,password);
    
    try{
        const existingBusinessUser = await BusinessUsers.findOne({email})
        if(existingBusinessUser){
            res.status(406).json("User already exists")
        }else{
            const newUser =  new BusinessUsers({
                username,
                businessname,
                email,
                password,
                LicenseNo:"",
                LicenseImg:"",
                PancardImg:"",
                    
                BusinessType:"",
                GSTNo:"",
                BankDetails:{
                    Name:"",
                    AccountNo:"",
                    IFSCode:"",

                },
                PanName:"",
                PanCardNo:"",
                photo:"",
                address: "",
                latitude: "",
                longitude: "",
                
                
            })
            await newUser.save()
            const token=jwt.sign({userId:newUser._id},"secretkey")
            res.status(200).json({newUser,token})

        }

    }
    catch(err){
        res.status().json(err)
    }
}
exports.BusinessLogin=async (req,res) => {
    const {email,password} = req.body
    try{
        const existingBusinessUser=await BusinessUsers.findOne({email,password})
        if(existingBusinessUser){
            const token=jwt.sign({userId:existingBusinessUser._id},"secretkey")
            res.status(200).json({existingBusinessUser,token})

        }
        else{
            res.status(406).json("incorect email or password")
        }

        }

    catch(err){
        res.status().json(err)
    }
}
exports.BusinessRegistration = async (req, res) => {
    const userId = req.payload;
    const uploadedFiles = req.files;

    const licenseImgFilename = uploadedFiles?.LicenseImg?.[0]?.filename || null;
    const pancardImgFilename = uploadedFiles?.PancardImg?.[0]?.filename || null;
    const photoFilename = uploadedFiles?.photo?.[0]?.filename || null;

    const {
        username,
        businessname,
        email,
        password,
        LicenseNo,
        BusinessType,
        GSTNo,
        BankDetails: { Name, AccountNo, IFSCode },
        PanName,
        PanCardNo,
        address,
        latitude,
        longitude
    } = req.body;

    try {
        const existingBusinessUser = await BusinessUsers.findByIdAndUpdate(
            { _id: userId },
            {
                username,
                businessname,
                email,
                password,
                LicenseNo,
                LicenseImg: licenseImgFilename,
                PancardImg: pancardImgFilename,
                BusinessType,
                GSTNo,
                BankDetails: { Name, AccountNo, IFSCode },
                PanName,
                PanCardNo,
                photo: photoFilename,
                address,
                latitude,
                longitude
            },
            { new: true }
        );

        if (!existingBusinessUser) {
            return res.status(404).json({ message: "User not found" });
        }

        await existingBusinessUser.save();
        res.status(200).json({ existingBusinessUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error });
    }
};
exports.pendingUsers= async (req, res) => {
   try{
    const pendingusers= await BusinessUsers.find({status:"Pending"})
    res.status(200).json(pendingusers);
   }catch(err){
    res.status(400).json(err)
   }
}
exports. approvalusers =async(req,res)=>{
   
    //console.log(req.params);
    const {id}=req.params
    
    //console.log(req.body);
   try{
    const {status}=req.body
    //console.log(status);
    
    const approveduser= await BusinessUsers.findByIdAndUpdate(id,{status:status},{ new: true })
    res.status(200).json(approveduser)
   }catch(err) {
    res.status(400).json(err)
   }
   
}
 exports.businessusers=async(req,res)=>{
    try{
        const businessusers=await BusinessUsers.find({status:"approved"})
        res.status(200).json(businessusers)
    }catch(err){
        res.status(400).json(err)
    }
 }
 exports.userstatics=async(req,res)=>{
    try{

        const businessUsersCount = await BusinessUsers.countDocuments();
        const normalUsersCount = await NormalUsers.countDocuments();
     res.status(200).json({
        businessUsers: businessUsersCount,
        normalUsers: normalUsersCount,
      })
    }catch(err){
        res.status(400).json(err)
    }
 }
 exports.businessuser=async(req,res)=>{
   
    const userId = req.payload
    //console.log(userId);
    
    try{
    const businessUsers=await BusinessUsers.findById(userId)
    res.status(200).json(businessUsers)
    }catch(err){
        res.status(406).json(err)
    }

 }