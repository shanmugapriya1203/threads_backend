import mongoose from "mongoose";

const PostSchema= new mongoose.Schema({
    postedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    text:{
        type:String,
        maxLength:500
    },
    img:{
        type:String
    },
    liked:{
        type:Number,
        default:0
    },
    replies:[
        {
            userId:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'User',
                required:true
            },
            text:{
                type:String
            },
            userProfilePic:{
                type:String
            },
            username:{
                type:String
            }
        }
    ]
},{
    timestamps:true
})

const Post= mongoose.model('Post',PostSchema)
export default Post