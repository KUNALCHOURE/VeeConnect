import {User}from "../modles/usermodel";
import httpStatus from "http-status";
import bcrypt,{hash} from "bcrypt";



const login=async(req,res)=>{
    const{username,password}=req.body();
  if(!username || !password){
    return res.status(400).json({message:"Please provide"});
  }
    try{
        const exist=await User.find(username);
        if(!exist){
            return res.status(httpStatus.NOT_FOUND).json({message:"user not exist"});            
        }
        
        if(bcrypt.compare(password,User.password)){
            const token=crypto.randomBytes(20).toStrng("hex");
            User.token=token;
            await User.save();
            return res.status(httpStatus.OK).json({token:token});

        }
        
    }
    catch(e){
         return res.status(500).json({message:"Something went wrong "});
    }

}

const register=async(req,res)=>{
    const{name,username,password}=req.body;

    try{
        const existingguser=await User.find({username});
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

export {register,login};