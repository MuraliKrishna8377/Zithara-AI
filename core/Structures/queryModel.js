const M=require("mongoose");

const Q=new M.Schema({
  userId:{type: M.Schema.Types.ObjectId,ref: "User",required: true,},
  question:{type: String,required: true,},
  answer:{type: String,},
  Date:{type: Date,default: Date.now,},
  isDefault:{type: Boolean,default: false}
  
});
module.exports=M.model("Query", Q);
