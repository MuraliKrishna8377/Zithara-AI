const E = require("express");
const C = require("cors");
const D = require("dotenv");
const connectS = require("./configuration/Storage");

const aRoutes = require("./routes/authenticationRoutes");
const pRoutes = require("./routes/protectedRoutes");
const qRoutes = require('./routes/queryRoutes');
const adminRoutes = require('./routes/adminRoutes');

D.config(); 
connectS();

const app = E();
app.use(C());

// ✅ Use this instead of app.use(E.json())
app.use(E.json({
  verify: (req, res, buf) => {
    console.log("Incoming RAW body:", buf.toString()); // 👈 logs raw JSON body
  }
}));

// ✅ Route middleware (keep below json + cors middlewares)
app.use("/api/auth", aRoutes);
app.use("/api/protected", pRoutes);
app.use('/api/queries', qRoutes);
app.use('/api/admin', adminRoutes); 

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
