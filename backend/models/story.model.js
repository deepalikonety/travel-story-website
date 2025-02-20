import mongoose from "mongoose";
import { Schema } from "mongoose";

const travelStorySchema=new Schema({
  title:{type:String,required:true},
  story:{type:String,required:true},
  visitedPlace:{type:[String],default:[]},
  isFavourite:{type:Boolean,default:false},
  userId:{type:Schema.Types.ObjectId,ref:"User",required:true},
  createdOn:{type:Date,default:Date.now},
  imageUrl:{type:String,required:true},
  visitedDate:{type:String,required:true},
  

});
export default mongoose.model("TravelStory",travelStorySchema);