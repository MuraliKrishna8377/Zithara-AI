const E=require("express");
const a=require("../helpers/authenticationhelpers");

const r=E.Router();

r.get("/dashboard", a, (req, res) => {
  res.json({ message: `Welcome, your ${req.user.role}`, user: req.user });
});

module.exports=r;
