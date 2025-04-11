const M=require("mongoose");
const Q=new M.Schema({
  //we are datatypes of userId,question,answer,DAte.
  userId:{type: M.Schema.Types.ObjectId,ref: "User",required: true,},
  question:{type: String,required: true,},
  answer:{type: String,default: "",},
  Date:{type: Date,default: Date.now,},
});

module.exports=M.model("Query", Q);
