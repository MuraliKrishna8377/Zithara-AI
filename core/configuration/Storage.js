const mongoose=require("mongoose");
require("dotenv").config();
const connectStorage=async () => {
    const mongoatlas=process.env.MONGOATLAS_URI;
    if (!mongoatlas) {
    // Here we are checking is there mongourl is given or not
    console.error("mongo_url is not found or given");
    process.exit(1);

}
try{
    // If there is url then code is
    await mongoose.connect(process.env.MONGOATLAS_URI);
    // If the url is correct
    console.log("MongoDB is connected sucessfully");

} //if the url got a error
catch (error) {
    console.error("Facing MongoDB connection URL error:", error.message);
  }
}
  module.exports=connectStorage;
