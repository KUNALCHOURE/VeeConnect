const mongoose=require("mongoose")
const {Schema}=require("mongoose");

const userschema=new Schema(
    {
        name:{
            type:String,
            required:true
        },
        username:{
            type:String,
            required:true,
            unique:true
        },
        password:{
            type:String,
            required:true
        },
        token:{
            type:String
        }

    }
)

const user=mongoose.model("user",userschema);
module.exports=user;
