import User from "../models/userModel.js";
import  bcrypt from 'bcryptjs'
import generateTokenAndSetCookie from './../utils/helpers/generateTokenAndSetCookie.js';



export const getUserProfile = async (req, res) => {
  const { username } = req.params;
  console.log("Username:", username); 
  try {
    const user = await User.findOne({ username }).select('-password -updatedAt');
    if (!user) {
      console.log("User Not Found");
      return res.status(400).json({ message: "User Not Found" });
    }
    console.log("User Found:", user); // Add this line for debugging
    res.status(200).json(user);
  } catch (error) {
    console.error("Error in getUserProfile:", error.message);
    res.status(500).json({ message: error.message });
  }
}








export const signupUser= async(req,res)=>{
try {
    const{name,email,username,password}=req.body;
    const user= await User.findOne({
        $or:[{email},{username}]})
        if(user){
            return res.status(400).json({message:'User already exists'})
        }
        const salt= await bcrypt.genSalt(10);
        const hashedPassword= await bcrypt.hash(password,salt)
        const newUser= new User({
            name:name,
            email:email,
            username:username,
            password:hashedPassword
        })
        await newUser.save()
        if(newUser){
            generateTokenAndSetCookie(newUser._id,res);
            res.status(201).json({
                id:newUser._id,
                name:newUser.name,
                email:newUser.email,
                username:newUser.username
            })
        }else{
            res.status(400).json({message:"Invalid User Data"})
        }
} catch (error) {
    res.status(500).json({message:error.message})
    console.log("Error in signup:", error.message)
}
}

export const loginUser = async (req, res) => {
    try {
      const { username, password } = req.body;
      
      // Find the user based on the username
      const user = await User.findOne({ username: username });
  
      if (!user) {
        return res.status(400).json({ message: "Invalid username or password" });
      }
  
      const isPasswordCorrect = await bcrypt.compare(password, user?.password);
  
      if (!isPasswordCorrect) {
        return res.status(400).json({ message: "Invalid username or password" });
      }
  
      generateTokenAndSetCookie(user._id, res);
  
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
      });
    } catch (error) {
      res.status(500).json({ message: "Error occurred" });
      console.log("Error in login User", error.message);
    }
  };
  
  export const logoutUser= async(req,res)=>{
    try {
        res.cookie("jwt","",{maxAge:1})
        res.status(200).json({message:"User logged out successfully"})
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log("Error in logout User", error.message);
    }
  }

  export const followUnFollowUser = async (req, res) => {
    try {
      const { id } = req.params;
      const userToModify = await User.findById(id);
      const currentUser = await User.findById(req.user._id);
  
      if (id.toString() === req.user._id.toString()) {
        return res.status(400).json({ message: "You cannot follow or unfollow yourself" });
      }
  
      if (!userToModify || !currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
  
      const isFollowing = currentUser.following.includes(id);
  
      if (isFollowing) {
        // Unfollow User
        await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
        await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
        res.status(200).json({ message: "User unfollowed successfully" });
      } else {
        // Follow User
        await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
        await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
        res.status(200).json({ message: "User followed successfully" });
      }
    } catch (error) {
      console.error("Error in Follow and Unfollow User", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  

  export const updateUser= async(req,res)=>{
  
      const {name,email,username,password,profilepic,bio}=req.body
      const userId= req.user._id;
      try {
        let user= await User.findById(userId)
        if(!user){
          return req.status(400).json({message:"User not found"})
        }
        if(req.params.id !== userId.toString())
        return res.status(400).json({message:"You cannot update other user's profile"})

        if(password){
          const salt= await bcrypt.genSalt(10)
          const hashedPassword= await bcrypt.hash(password,salt)
          user.password=hashedPassword
        }
        user.name= name || user.name;
        user.email= email || user.email
        user.username= username || user.username;
        user.profilepic = profilepic || user.profilepic;
        user.bio = bio || user.bio
         user=await user.save()
         res.status(200).json({message:"Profile Updated Successfully",user})
      } catch (error) {
        res.status(500).json({ message: error.message });
        console.log("Error in logout User", error.message);
      }
  
  }

  