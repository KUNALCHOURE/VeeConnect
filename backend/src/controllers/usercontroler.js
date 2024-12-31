import  User from "../modles/usermodel.js";
import httpStatus from "http-status";
import bcrypt,{hash} from "bcrypt";
import crypto from "crypto";
import meeting from "../modles/meetingmodel.js";


const login=async(req,res)=>{
    const{username,password}=req.body;
    {console.log(username);
    console.log(password);
  
    }
  if(!username || !password){
    return res.status(400).json({message:"Please provide"});
  }

    try{
        const user=await User.findOne({username});
        {console.log(user.password)}
        if(!user){
            return res.status(httpStatus.NOT_FOUND).json({message:"user not exist"});            
        }
         const ismatch=await bcrypt.compare(password,user.password);
         if (!ismatch) {
            return res.status(httpStatus.UNAUTHORIZED).json({ message: "Incorrect password" });
          }
        if(ismatch){
            const token=crypto.randomBytes(20).toString("hex");
            user.token=token;
            await user.save();
            return res.status(httpStatus.OK).json({message:`login succesfully  , Token:${token}`});

        }
        
    }
    catch(e){
         return res.status(500).json({message:"Something went wrong "});
    }

}

const register=async(req,res)=>{
    const{name,username,password}=req.body;

    try{
        const existingguser=await User.findOne({username});
        {console.log(existingguser)
        }
        if(existingguser){
            return res.status(httpStatus.FOUND).json({message:"user already exist "});
        }

        const hashedpasswword=await bcrypt.hash(password,10);
       const newuser=new User({
        name:name,
        username:username,
        password:hashedpasswword
       });

       await newuser.save();
       
       res.status(httpStatus.CREATED).json({message:"User Registered"})


    }
    
    catch(e){
         res.json({message: `Something went wrong: ${e}`});
    }
}

const getuserhistory=async(req,res)=>{
    const{token}=req.query;
    try{
        const user =await User.findOne({token:token})
        const meet=await meeting.find({user_id:user.username})
        res.json(meeting)
    }
    catch(e){
          res.json({message:`something went wrong ${e}`})
    }
}


const addtohistory=async(req,res)=>{
 const{token,meeting_code}=req.body;

 try{
    const user=await User.findOne({token:token});
    const newmeeting=new meeting({
        user_id:username,
        meeting_id:meeting_code
    });

    await newmeeting.save();
    res.status(httpStatus.CREATED).json({message:"Added the code to the history "})

 }
 catch(e){
    res.json({message:`Something wrong occured ${e}`})

 }
}




export {register,login,addtohistory,getuserhistory};