
const M=require('mongoose');
const b=new M.Schema({
  // we are mention the data type od Q&A
  question:{ type: String, required: true },
  answer:{ type: String, required: true }
});

module.exports=M.model('DefaultQuestion', b);
