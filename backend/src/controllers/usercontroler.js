import  user from "../modles/usermodel.js";
import httpStatus from "http-status";
import meeting from "../modles/meetingmodel.js";
import asynchandler from "../../utils/asynchandler.js";
import Apierror from "../../utils/Apierror.js";
import Apiresponse from "../../utils/Apiresponse.js";
import jwt from "jsonwebtoken";

const generateAccessandrefreshtoken = asynchandler(async (userID) => {
  try {
    let userinfo = await user.findById(userID);

    const accesstoken = await userinfo.generateAcessToken();
    const refreshtoken = await userinfo.generateRefreshToken();


  
    userinfo.refreshtoken = refreshtoken;
    await userinfo.save({ validateBeforeSave: false });

    return { accesstoken, refreshtoken };
  } catch (error) {
    throw new Apierror(500, error.message||"Something went wrong while creating access and refresh token");
  }
});


const registerUser = asynchandler(async (req, res) => {
  console.log("inside the register controllers")
  let { fullname, username, email, password } = req.body; // Add role with default value
  console.log(fullname);
  console.log(username);
 

  if ([fullname, email, username, password].some((field) => field?.trim() === "")) {
    throw new Apierror(400, "All fields are required");
  }

  console.log("1st");
  let existeduser = await user.findOne({
    $or: [{ username }, { email }],
  });

  console.log("2nd")
  if (existeduser) {
    throw new Apierror(409, "User with username or email already exists");
  }
  console.log("second");

  const usersave = await user.create({
    username: username.toLowerCase(),
    email,
    fullname,
    password,
   
  });
  console.log("3rd");

  const createduser = await user.findById(usersave._id).select("-password -refreshtoken");
  if (!createduser) {
    throw new Apierror(500, "There is a problem while registering the user");
  }

  console.log("Generating tokens...");
    
  // Generate tokens with role included
  const { accesstoken, refreshtoken } = await generateAccessandrefreshtoken(usersave._id);

  // Set tokens in HTTP-only cookies
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
  };

  console.log("Register complete - sending response");
    
  // Return user data + tokens
  return res.status(201)
    .cookie("accessToken", accesstoken, options)
    .cookie("refreshToken", refreshtoken, options)
    .json(new Apiresponse(
      200, 
      { 
        user: {
          ...createduser.toObject(),
          role: createduser.role  // Explicitly include role in response
        }, 
        accesstoken, 
        refreshtoken 
      }, 
      "User registered successfully"
    ));
});
const loginuser = asynchandler(async (req, res) => {
  let { email, username, password } = req.body;

  if (!username && !email) {
    throw new Apierror(400, "Username or email is required");
  }

  let result = await user.findOne({
    $or: [{ username: username }, { email: email }],
  });

  if (!result) {
    throw new Apierror(400, "User does not exist");
  }

  let ispasscorrect = await result.ispasswordcorrect(password);
  if (!ispasscorrect) {
    throw new Apierror(400, "Incorrect password");
  }

  const { accesstoken, refreshtoken } = await generateAccessandrefreshtoken(result._id);
  console.log("🔍 Access Token:", accesstoken);

  const loggedinuser = await user.findById(result._id).select("-password -refreshtoken");

  // ✅ Corrected cookie settings
  res.cookie("accessToken", accesstoken, {
    httpOnly: true,
    secure: true,  // ✅ Always true for production
    sameSite: "None",  // ✅ Required for cross-origin requests
    path: "/",
  });

  res.cookie("refreshToken", refreshtoken, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    path: "/",
  });

  return res.status(200).json(new Apiresponse(200, { user: loggedinuser, accesstoken, refreshtoken }, "User logged in successfully"));
});


const logoutuser = asynchandler(async (req, res) => {
  console.log("login out");
    let userid = req.user._id;
  await user.findByIdAndUpdate(userid, { $set: { refreshtoken: undefined } }, { new: true });

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Ensure this matches your environment
    sameSite: "None", // Required for cross-origin requests
    path: "/", // Ensure this matches the path used when setting the cookies
  };
  console.log("user loged out succesfully ")
  return res.status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new Apiresponse(200, {}, "User logged out"));
});

const refreshaccesstoken = asynchandler(async (req, res) => {
  try {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
    if (!incomingRefreshToken) {
      throw new Apierror(400, "Unauthorized access");
    }

    const decodedtoken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
    const founduser = await user.findById(decodedtoken?._id);
    if (!founduser || incomingRefreshToken !== founduser.refreshtoken) {
      throw new Apierror(401, "Invalid refresh token");
    }

    const options = { httpOnly: true, secure: true };
    const { accesstoken, refreshtoken } = await generateAccessandrefreshtoken(founduser._id);

    return res.status(200)
      .cookie("accessToken", accesstoken, options)
      .cookie("refreshToken", refreshtoken, options)
      .json(new Apiresponse(200, { accesstoken, refreshtoken }, "Access token refreshed successfully"));
  } catch (err) {
    throw new Apierror(400, err.message || "There is a problem while refreshing token");
  }
});



const changecurrectuserpassword=(asynchandler(async(req,res)=>{
    const {oldpassword,newpassword}=req.body;
  
    const userfind=await user.findById(req.user?._id);
 
    const ispasscorrect=await userfind.ispasswordcorrect(oldpassword);
     
     if(!ispasscorrect){
       throw new Apierror(400,"The oldpassword is not coorect please enter the correct password ")
     }
 //saving the new password in the database 
      userfind.password=newpassword;   // isme await mat lagana 
      // we dont want other validations to run so we are writting validatebeforesave:false;
     console.log(userfind.password)
       await userfind.save({validateBeforeSave:false});
       
 
   return res
   .status(200)
   .json(
     new Apiresponse(200,{}
       ,"Password changes successfully"
     )
   )
 
 }))
 
 
 const getcurrectuser=asynchandler(async(req,res)=>{
 let userobject=req.user;
     // select method dont work on js object 
     // they only work on mongoose query
   return res.status(200)
   .json(
     new Apiresponse(200,
     { userobject}
     ,"The user is succesfully found ")
 
   )
 
    
 })
 
 
 //when you are updating files so make different controllers for them because  text data will save many time so it is not a good practice  
 const updateaccount=asynchandler(async(req,res)=>{
   
   let{username,fullname,email}=req.body;
 
   if(!username || !fullname || !email){
     throw new Apierror(400,"Values are empty");
 
   }
  console.log(fullname);
  const userfind=await user.findByIdAndUpdate(req.user?._id,{
   $set:{
     username:username,
     fullname:fullname,
     email:email,
   },
  },{new:true,select:"-password"}
 ); // new:true se ye hota hai ki updatehone ke bad jo inormation hai woh hame miljati hai
 
 console.log(userfind);
   if(!userfind){
     throw new Apierror(400,"Unauthorizzed access");
 
   }
   req.user=userfind;
   
 return res.status(200)
 .json(new Apiresponse(200,{},"account updated successfully "));
 }
 );
 
 

const addtohistory=asynchandler(async(req,res)=>{
 const{meeting_code}=req.body;

 try{
   const user=req.user;
    const newmeeting=new meeting({
        user_id:user.username,
        meeting_id:meeting_code
    });

    await newmeeting.save();
    res.status(httpStatus.CREATED).json({message:"Added the code to the history "})

 }
 catch(e){
    res.json({message:`Something wrong occured ${e}`})

 }
});



export {
    registerUser,
    loginuser,
    logoutuser,
    refreshaccesstoken,
    changecurrectuserpassword,
    getcurrectuser,
    updateaccount,
    addtohistory,
  };