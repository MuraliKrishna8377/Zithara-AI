const E = require('express');
const r = E.Router();
const U = require('../Structures/UserSideModel');
const Query_H = require('../Structures/Query_history');
const DFQ = require('../Structures/DFquestions');
const OS = require('../Structures/OrderStatus');
const A = require('../helpers/authenticationhelpers');

// 1. GET admin only
r.get('/stats', A, async (req, res) => {
  if (req.user.role !== 'Admin') {
    //error message
    return res.status(403).json({ message: 'Access denied. Admins only.' });
  }
  try {//counting of user and Qurey
    const userCount = await U.countDocuments();
    const queryCount = await Query_H.countDocuments();

    res.status(200).json({
      users: userCount,
      queries: queryCount,
    });
  } catch (err) {
    //error message
    res.status(500).json({ message: 'Error fetching stats', error: err.message });
  }
});

// adding a default question
r.post('/defaults', A, async (req, res) => {
  if (req.user.role !== 'Admin') {
    // if not admin
    return res.status(403).json({ message: 'Access denied. Admins only.' });
  }
// fields in adding default Q&A
  const { question, answer } = req.body;
  try {
    // adding new default question
    const newDefault = new DFQ({ question, answer });
    await newDefault.save();
    //Confirmation message (popup)
    res.status(201).json({ message: 'Default question added successfully' });
  } catch (err) {
    // if error occured pop up error message 
    console.error('Error adding default question:', err);
    res.status(500).json({ message: 'Failed to add default question' });
  }
});

// fetching all the default questions
r.get('/defaults', A, async (req, res) => {
  try {
    const defaults = await DFQ.find();
    res.status(200).json({ defaults });
  } catch (err) {
    // if there is prblnm in fetching the error message
    console.error('Error fetching default questions:', err);
    res.status(500).json({ message: 'Failed to fetch default questions' });
  }
});

// deleting a default question
r.delete('/defaults/:id', A, async (req, res) => {
  if (req.user.role !== 'Admin') {
    // only admin can delet the default question
    return res.status(403).json({ message: 'Access denied. Admins only.' });
  }
 try {
    const { id } = req.params;
    const deleted = await DFQ.findByIdAndDelete(id);

    if (!deleted) {
        // while doing the delet operation is default question is not fount in storage
      return res.status(404).json({ message: 'Default question not found in Storage' });
    }
// if default questuion is found and deleted successfully
    res.status(200).json({ message: 'Default question deleted successfully from the Database' });
  } catch (err) {
    //if there error
    console.error('Error deleting default question:', err);
    res.status(500).json({ message: 'Failed to delete default question' });
  }
});

// code fo adding and editing the order status
r.post('/orders', A, async (req, res) => {
  if (req.user.role !== 'Admin') {
    // only for admin
    return res.status(403).json({ message: 'Access denied. Admins only.' });
  }

  const { orderId, status } = req.body;
  if (!orderId || !status) {
    return res.status(400).json({ message: 'Order ID and status are required' });
  }

  try {
    const existingId = await OS.findOne({ orderId });
    // if it is existing order id then the new status will be updated
    if (existingId) {
      existingId.status = status;
      await existingId.save();
      return res.status(200).json({ message: 'Order status updated Successfully' });
    }
// if it is a new orderId
    const newOrderId = new OS({ orderId, status });
    await newOrderId.save();
    res.status(201).json({ message: 'Order status added in storage' });
  } catch (err) {
    // error message while 
    res.status(500).json({ message: 'Failed to add/update order in storage', error: err.message });
  }
});

//To get all orders
r.get('/orders', A, async (req, res) => {
  try {
    const orders = await OS.find().sort({ createdAt: -1 });
    res.status(200).json({ orders });
  } catch (err) {
    //error message
    res.status(500).json({ message: 'Failed to fetch orders from database', error: err.message });
  }
});
//To delete an order status from stroage
r.delete('/orders/:id', A, async (req, res) => {
  try {
    const deleted = await OS.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Order not found' });
    }//confirmation message
    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (err) {// error message
    res.status(500).json({ message: 'Failed to delete order', error: err.message });
  }
});

module.exports = r;
