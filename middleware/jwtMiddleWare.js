//import jwt
const jwt=require('jsonwebtoken')

const jwtmiddleware=(req,res,next)=>{
    console.log('inside jwt middleware');
    if (!req.headers['authorization']) {
        req.user = null; // No token, proceed as a guest
        return next();
      }
    
    //console.log(token);
    try{
        const token=req.headers['authorization'].split(" ")[1]
        const jwtResponse=jwt.verify(token,"secretkey")
        //console.log(jwtResponse);
        req.payload = jwtResponse.userId
        next()
        
    }catch(error){
        res.status(401).json('Authorisation failed',error)
    }
   
    
    
}
module.exports=jwtmiddleware