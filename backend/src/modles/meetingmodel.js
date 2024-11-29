const mongoose=require("mongoose")
const {Schema}=require("mongoose");

const meetingschema=new Schema(
    {
        user_id:{type:String},
        meeting_id:{type:String,required:true},
        Date:{type:Date,default:Date.now,required:true},

    }
)

const meeting=mongoose.model("meeting",meetingschema);
module.exports=meeting;