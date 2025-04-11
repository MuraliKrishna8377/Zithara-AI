
const E=require("express");
const { Register, Login }=require("../controllers/authenticationController");
const r=E.Router();

r.post("/register", Register);
r.post("/login", Login);

module.exports = r;
