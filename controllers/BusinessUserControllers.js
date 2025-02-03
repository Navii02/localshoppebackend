const BusinessUsers = require('../models/BusinessUser')
const jwt= require('jsonwebtoken')
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
