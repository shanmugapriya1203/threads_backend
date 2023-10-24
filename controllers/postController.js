import Post from "../models/postModel.js";
import User from "../models/userModel.js";

export const createPost = async (req, res) => {
  try {
    const { postedBy, text, img } = req.body;

    if (!postedBy || !text) {
      return res.status(400).json({ message: "postedBy and text fields are required" });
    }

    const user = await User.findById(postedBy);

    if (!user) {
      return res.status(404).json({ message: "User Not found" });
    }

    if (user._id.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Unauthorized to create post" });
    }

    const maxLength = 500;
    if (text.length > maxLength) {
      return res.status(400).json({ message: `Text must be less than ${maxLength} characters` });
    }

    const newPost = new Post({
      postedBy, text, img
    });

    await newPost.save();
    
    return res.status(201).json(newPost); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};



export const getPost= async(req,res)=>{
    try {
        const post= await Post.findById(req.params.id)
        if(!post)
        {
            return res.status(404).json({message:"Post not Found"})
        }
        res.status(200).json({message:"Post Found",post})
    } catch (error) {
        console.error(error);
    res.status(500).json({ message: "Internal Server Error" }); 
    }
}


export const deletePost= async(req,res)=>{
    try {
        const post= await Post.findById(req.params.id)
        if(!post){
            return res.status(404).json({message:"Post not found"})
        }
        if(post.postedBy.toString() !== req.user._id.toString()){
return res.status(401).json({message:"Unauthorized to delete post"})
    }   
      await Post.findByIdAndDelete(req.params.id)
      res.status(200).json({message:"Post Deleted Successfuly"})
 }

    
    
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" }); 
    }
}

export const likeUnlikePost = async (req, res) => {
    try {
        const { id: postId } = req.params;
        const userId = req.user._id;
        const post = await Post.findById(postId);
        
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
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
        res.status(500).json({ message: "Internal Server Error" });
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
            return res.status(400).json({message:"Text filed is required"})
        }
        const post= await Post.findById(postId)
        if(!post){
            return res.status(404).json({ message: "Post not found"})
        }
        const reply= { userId,text,userProfilePic,username}
        post.replies.push(reply)
        await post.save()
        res.status(200).json({message:"Reply added successfully",post})
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}