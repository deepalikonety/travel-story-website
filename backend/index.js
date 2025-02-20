import dotenv from "dotenv";
dotenv.config();
import config from "./config.json" assert { type: "json" };
import bcrypt from "bcrypt";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import User from "./models/user.model.js"; 
import TravelStory from "./models/story.model.js"
import authenticateToken  from "./utilities.js";
import  upload from "./multer.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { start } from "repl";
// Connect to MongoDB
mongoose.connect(config.connectionString, {});

// Initialize Express app
const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));

const __filename = fileURLToPath(import.meta.url); // Get the current file path
const __dirname = path.dirname(__filename); 
app.post("/create-account", async (req, res) => {
  try {
    console.log("Request body:", req.body); // Log request body
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      console.log("Validation failed");
      return res.status(400).json({ error: true, message: "All fields are required" });
    }

    const isUser = await User.findOne({ email });
    if (isUser) {
      console.log("User already exists");
      return res.status(400).json({ error: true, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    await user.save();
    console.log("User saved:", user);

    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "72h" }
    );

    res.status(201).json({
      error: false,
      user: { fullName: user.fullName, email: user.email },
      accessToken,
      message: "Account created successfully",
    });
  } catch (err) {
    console.error("Error in /create-account route:", err);
    res.status(500).json({ error: true, message: "Internal server error" });
  }
});

//Login
app.post("/login", async (req, res) => {
  console.log("POST /login called");
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and Password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "72h" }
    );

    res.status(200).json({
      message: "Login successful",
      user: { email: user.email, fullName: user.fullName },
      accessToken,
    });
  } catch (err) {
    console.error("Error in /login route:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});
//Get User
app.get("/get-user",authenticateToken, async (req, res) =>{
  const {userId}=req.user;
  const isUser=await User.findOne({_id:userId});
  if(!isUser){
    return res.sendStatus(401);

  }
  return res.json({
    user:isUser,
    message:"",
  });
});
//Add your story
app.post("/add-story",authenticateToken, async (req, res) =>{
  const{title,story,visitedPlace,imageUrl,visitedDate}=req.body;
  const{userId}=req.user;
  if(!title||!story ||!visitedPlace||!imageUrl||!visitedDate){
    return res.status(400).json({error:true,message:"All fields are required"});
  }

const parsedVisitedDate=new Date(parseInt(visitedDate));
try{
  const travelstory=new TravelStory({
    title,
    story,
    visitedPlace,
    userId,
    imageUrl,
    visitedDate:parsedVisitedDate,

  });
  await travelstory.save();
  res.status(201).json({story:travelstory,message:"Added Successfully"});
}catch(error){
  res.status(400).json({error:true,message:error.message});
}
});

//Get All Travel Sories
app.get("/get-all-stories",authenticateToken, async (req, res) =>{
    const{userId}=req.user;
    try{
      const travelStories=await TravelStory.find({userId:userId}).sort({
        isFavourite:-1,
      });
      res.status(200).json({stories:travelStories});

    }catch(error){
      res.status(500).json({error:true,message:error.message});
    }
});

//Route to handle image upload
app.post("/image-upload",upload.single("image"), async (req, res) =>{
  try{
    if(!req.file){
      return res.status(400).json({error:true,message:"No image uploaded"});
    }
    const imageUrl=`http://localhost:3001/uploads/${req.file.filename}`;
    res.status(200).json({imageUrl});

  }catch(error){
    res.status(500).json({error:true,message:error.message});
  }
});
app.delete("/delete-image",async(req,res)=>{
  const{imageUrl}=req.query;
  if(!imageUrl){
    return res.status(400).json({error:true,message:"imageurl parameter is required"});
  }
  try{
    const filename=path.basename(imageUrl);

    const filePath=path.join(__dirname,'uploads',filename);
    if(fs.existsSync(filePath)){
      fs.unlinkSync(filePath);
      res.status(200).json({message:"Image deleted Successfully"});
    } else{
      res.status(200).json({error:true,message:"Image not found"});
    }
  } catch(error){
    res.status(500).json({error:true,message:error.message});
  }
});

//Serve static files 
app.use("/uploads",express.static(path.join(__dirname,"uploads")));
app.use("/assets",express.static(path.join(__dirname,"assets")));
// Start server
app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
app.put("/edit-story/:id",authenticateToken, async (req, res) =>{
 const {id}=req.params;
 const {title,story,visitedPlace,imageUrl,visitedDate}=req.body;
 const{userId}=req.user;

 if(!title||!story ||!visitedPlace||!visitedDate){
  return res.status(400).json({error:true,message:"All fields are required"});
}
const parsedVisitedDate=new Date(parseInt(visitedDate));
try{
  const travelstory=await TravelStory.findOne({_id:id,userId:userId});
  if(!travelstory){
    return res.status(404).json({errorr:true,message:"Travel story not found"});
  }
  const placeholderImageUrl=`http://localhost:8000/assets/Title.jpeg`;

  travelstory.title=title;
  travelstory.story=story;
  travelstory.visitedPlace=visitedPlace;
  travelstory.imageUrl=imageUrl || placeholderImageUrl;
  travelstory.visitedDate=parsedVisitedDate;

  await travelstory.save();
  res.status(200).json({story:travelstory,message:'Updated Successfully'});
}catch (error){
  res.status(500).json({error:true,message:error.message});

}

});

app.delete("/delete-story/:id",authenticateToken, async (req, res) =>{
  const {id}=req.params;
  const{userId}=req.user;
  try{
    const travelstory=await TravelStory.findOne({_id:id,userId:userId});
    if(!travelstory){
      return res.status(404).json({errorr:true,message:"Travel story not found"});
    }
    await travelstory.deleteOne({_id:id,userId:userId});

    const imageUrl=travelstory.imageUrl;
    const filename=path.basename(imageUrl);
    const filePath=path.join(__dirname
      ,'uploads',filename);
    fs.unlink(filePath,(err)=>{
      if(err){
        console.error("Failed to delete image file:",err);
      }
    });
    res.status(200).json({message:"Travel story deleted successfully"}); 
  }catch (error){
    res.status(500).json({error:true,message:error.message});
    
  }
});

app.put("/update-is-fav/:id",authenticateToken, async (req, res) =>{
  const{id}=req.params;
  const{isFavourite}=req.body;
  const{userId}=req.user;
  try{
    const travelstory=await TravelStory.findOne({_id:id,userId:userId});
    if(!travelstory){
      return res.status(404).json({errorr:true,message:"Travel story not found"});
    }
    travelstory.isFavourite=isFavourite;
    await travelstory.save();
    res.status(200).json({story:travelstory,message:"updated successfully"});
  }catch(error){
    res.status(500).json({error:true,message:error.message});
  }
});

app.get("/search",authenticateToken, async (req, res) =>{
  const{query}=req.query;
  const{userId}=req.user;

  if(!query){
    return res.status(404).json({error:true,message:"query is required"});
  }
  try{
    const searchResults=await TravelStory.find({
      userId:userId,
      $or:[
        {title:{$regex:query,$options:"i"}},
        {story:{$regex:query,$options:"i"}}, {visitedPlace:{$regex:query,$options:"i"}}

      ],
    }).sort({isFavourite:-1});
    res.status(200).json({stories:searchResults});
  }catch(error){
    res.status(500).json({error:true,message:error.message});
  }
});

app.get("/travel-stories/filter",authenticateToken, async (req, res) =>{
  
  const {startDate,endDate}=req.query;
  const{userId}=req.user;
  try{
    const start=new Date(parseInt(startDate));
    const end=new Date(parseInt(endDate));

    const filteredStories=await TravelStory.find({
      userId:userId,
      visitedDate:{$gte:start, $lte:end},
    }).sort({isFavourite:-1});
    res.status(200).json({stories:filteredStories});
  }catch(error){
  res.status(500).json({error:true,message:error.message});
}
});
// Export app
export default app;
