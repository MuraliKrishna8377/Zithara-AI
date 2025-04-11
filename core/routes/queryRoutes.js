const E = require('express');
const r = E.Router();
require('dotenv').config();
const { CohereClient } = require("cohere-ai");
const a = require('../helpers/authenticationhelpers');
const Query_H = require('../Structures/Query_history');
const DFQ = require('../Structures/DFquestions');
const OS = require('../Structures/OrderStatus');

const cohere = new CohereClient({
  token: process.env.COHERE_AI_API_KEY,
});

const generateCompanyPrompt = (userQuestion) => `
Hey there! I'm your go-to AI assistant for Zithara, where we bring you some cool AI-powered retail services.
Feel free to ask me anything about our products, services, refund policies, or any tech stuff related to Zithara.
But if you have questions that go beyond Zithara, I’ll have to say:
"Sorry, I can only help with questions about Zithara."

User asked: "${userQuestion}"
`;
r.post('/', a, async (req, res) => {
  // the question asked by user is default or not checking
  const { question, isDefault = false, answer: defaultAnswer } = req.body;

  if (!question) {
    //if no question
    return res.status(400).json({ message: "Question is required" });
  }

  try {
    // handling order id quer
    const orderIdRegex = /(?:order\s*(?:id)?\s*(?:is|=|:)?\s*#?)([a-zA-Z0-9]+)/i;
    const match = question.match(orderIdRegex);

    if (match) {
      const orderId = `#${match[1].toUpperCase()}`; // checking exactly whather the id is matching or not
      const OStatus = await OS.findOne({ orderId });

      const answerText = OStatus
        ? `Status of order ${orderId}: ${OStatus.status}`
        : `No status found for order ID ${orderId}`;

      const newQuery = new Query_H({
        userId: req.user.id,
        question,
        answer: answerText,
        isDefault: true,
      });

      await newQuery.save();

      return res.status(OStatus ? 200 : 404).json({ message: "Handled order status", query: newQuery });
    }

    // handling normal quires with AI
    let aiResponse = '';
    if (!isDefault) {
      const prompt = generateCompanyPrompt(question);
      const response = await cohere.generate({
        model: 'command-r-plus',
        prompt,
        max_tokens: 300,
      });
      aiResponse = response.generations[0].text.trim();
    }
// if query comes checking wheather it matches if default or not
    const newQuery = new Query_H({
      userId: req.user.id,
      question,
      answer: isDefault ? defaultAnswer : aiResponse,
      isDefault
    });

    await newQuery.save();
// udating the status
    res.status(201).json({ message: "Query submitted successfully", query: newQuery });
  } catch (err) {
    //error message
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

//User's Query History
r.get('/history', a, async (req, res) => {
  try {
    const Qu = await Query_H.find({ userId: req.user.id, isDefault: false }).sort({ createdAt: -1 });
    res.status(200).json({ queries: Qu });
  } catch (err) {
    // error message
    res.status(500).json({ message: "Server error while fetching query history", error: err.message });
  }
});

// Adimin View all quries
r.get('/all', a, async (req, res) => {
  if (req.user.role !== 'Admin') {//acces only for admin
    return res.status(403).json({ message: 'Access denied. Admins only.' });
  }

  try {
    const allQueries = await Query_H.find().sort({ createdAt: -1 });
    res.status(200).json({ queries: allQueries });
  } catch (err) {
    //error message
    res.status(500).json({ message: 'Server error while fetching all queries', error: err.message });
  }
});

// admin deleting a query
r.delete('/:id', a, async (req, res) => {
  if (req.user.role !== 'Admin') {//only for admin
    return res.status(403).json({ message: 'Access denied. Admins only.' });
  }

  try {
    const deletedQuery = await Query_H.findByIdAndDelete(req.params.id);
    if (!deletedQuery) {//if quer not found
      return res.status(404).json({ message: 'Query not found' });
    }//confirmation message
    res.status(200).json({ message: 'Query deleted successfully', deletedQuery });
  } catch (err) {//error message
    res.status(500).json({ message: 'Server error while deleting query', error: err.message });
  }
});
// updating Q&A
r.put('/:id', a, async (req, res) => {
  if (req.user.role !== 'Admin') {// only for admin
    return res.status(403).json({ message: 'Access denied. Admins only.' });
  }

  const { question, answer } = req.body;
//updating the query
  try {
    const updatedQuery = await Query_H.findByIdAndUpdate(
      req.params.id,
      { question, answer },
      { new: true }
    );

    if (!updatedQuery) {// if query not founf
      return res.status(404).json({ message: 'Query not found' });
    }
// confirmation message
    res.status(200).json({ message: 'Query updated successfully', updatedQuery });
  } catch (err) {// error message
    res.status(500).json({ message: 'Server error while updating query', error: err.message });
  }
});
// fetching default questions 
r.get('/defaults', a, async (req, res) => {
  try {
    const defaultQuestions = await DFQ.find().sort({ createdAt: -1 });
    res.status(200).json({ defaults: defaultQuestions });
  } catch (err) {
    //error message
    res.status(500).json({ message: 'Error fetching default questions', error: err.message });
  }
});

module.exports = r;
