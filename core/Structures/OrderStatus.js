const M=require('mongoose');
const OrderS=new M.Schema({
    // we are the data type of order!D and status
  orderId:{ type: String, required: true, unique: true },
  status:{ type: String, required: true },
});

module.exports=M.model('OrderStatus', OrderS);
