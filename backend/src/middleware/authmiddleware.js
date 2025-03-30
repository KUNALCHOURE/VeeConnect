import Apierror from '../../utils/Apierror.js'
import asynchandler from '../../utils/asynchandler.js'
import jwt from 'jsonwebtoken';
import User from '../modles/usermodel.js';

 const verifyJWT=asynchandler(async(req,_,next)=>{  //here res is not used so we can write _ in that place 
  try{
    console.log("🔍 Checking authentication...");
    console.log("🔍 Cookies received:", req.cookies);
    console.log("🔍 Authorization Header:", req.headers.authorization);
    const token= req.cookies?.accessToken|| req.header("Authorization")?.replace("Bearer ","");
 console.log("access token ",token);
  if(!token){
    throw new Apierror(401,"Unauthorised request");

  }
  //the veify verifies the access token
  const decodedtoken =jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
   console.log(decodedtoken);
  let userfind=await User.findById(decodedtoken?._id).select("-password -refereshtoken");


  if(!userfind){
    throw new Apierror(401,"invalid Access token" )
  }

  //adding new object in req so that we are able to acces the tokens in the logout function so that we can 
// easily find the user and logout the function 
  req.user=userfind;
  next();  //because it is the middleware
}
catch(err){
    throw new Apierror(401,err?.message || "invalid access token")
}

})

export {verifyJWT};
