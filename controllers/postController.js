import Post from "../models/postModel.js";
import User from "../models/userModel.js";
import { v2 as cloudinary} from 'cloudinary'
export const createPost = async (req, res) => {
  try {
    const { postedBy, text } = req.body;
    let {img} =  req.body;
    if (!postedBy || !text) {
      return res.status(400).json({ error: "postedBy and text fields are required" });
    }

    const user = await User.findById(postedBy);

    if (!user) {
      return res.status(404).json({ error: "User Not found" });
    }

    if (user._id.toString() !== req.user._id.toString()) {
      return res.status(401).json({ error: "Unauthorized to create post" });
    }

    const maxLength = 500;
    if (text.length > maxLength) {
      return res.status(400).json({ error: `Text must be less than ${maxLength} characters` });
    }
  if(img){
    const uploadResponse= await cloudinary.uploader.upload(img);
    img=uploadResponse.secure_url
  }

    const newPost = new Post({
      postedBy, text, img
    });

    await newPost.save();
    
    return res.status(201).json({message:"Post created Successfully",newPost}); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};



export const getPost= async(req,res)=>{
    try {
        const post= await Post.findById(req.params.id)
        if(!post)
        {
            return res.status(404).json({error:"Post not Found"})
        }
        res.status(200).json({message:"Post Found",post})
    } catch (error) {
        console.error(error);
    res.status(500).json({ error: "Internal Server Error" }); 
    }
}


export const deletePost= async(req,res)=>{
    try {
        const post= await Post.findById(req.params.id)
        if(!post){
            return res.status(404).json({error:"Post not found"})
        }
        if(post.postedBy.toString() !== req.user._id.toString()){
return res.status(401).json({error:"Unauthorized to delete post"})
    }   
      await Post.findByIdAndDelete(req.params.id)
      res.status(200).json({message:"Post Deleted Successfuly"})
 }

    
    
    catch (error) {
        console.error(error);
        res.status(500).json({error: "Internal Server Error" }); 
    }
}

export const likeUnlikePost = async (req, res) => {
    try {
        const { id: postId } = req.params;
        const userId = req.user._id;
        const post = await Post.findById(postId);
        
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }
        
        const userLikedPost = post.likes.includes(userId);
        
        if (userLikedPost) {
          
            post.likes.pull(userId);
            await post.save();
            res.status(200).json({ message: "Post unliked successfully" });
        } else {
            post.likes.push(userId);
            await post.save(); 
            res.status(200).json({ message: "Post liked successfully" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Internal Server Error" });
    }
}


export const replyPost= async(req,res)=>{
    try {
        const {text}= req.body;
        const postId= req.params.id;
        const userId= req.user._id;
        const userProfilePic= req.user.profilepic;
        const username= req.user.username;
        if(!text){
            return res.status(400).json({error:"Text filed is required"})
        }
        const post= await Post.findById(postId)
        if(!post){
            return res.status(404).json({error: "Post not found"})
        }
        const reply= { userId,text,userProfilePic,username}
        post.replies.push(reply)
        await post.save()
        res.status(200).json({message:"Reply added successfully",post})
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}


 export const getFeedPosts = async (req, res) => {
	try {
		const userId = req.user._id;
		const user = await User.findById(userId);
        console.log(user)
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		const following = user.following;

		const feedPosts = await Post.find({ postedBy: { $in: following } }).sort({ createdAt: -1 });

		res.status(200).json({"FeedPosts":feedPosts});
	} catch (err) {
        console.log(err)
		res.status(500).json({ error: err.message });
	}
};