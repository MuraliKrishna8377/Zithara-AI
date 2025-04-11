
const M=require("mongoose");

const U=new M.Schema({
  Username: {type: String,required: true,unique: true,},
  Email: { type: String,unique: true,required: true},
  Password:{type: String,required: true,},
  Role: { type: String, 
    enum: ["Customer", "Admin"], 
    default: "Customer" },
} ,{ timestamps: true });

module.exports= M.model("User", U);



