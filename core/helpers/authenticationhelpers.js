const jwtoken=require("jsonwebtoken");
// Middleware to authenticate requests using JWT
const a=(req, res, next) => {
  // Extract the Authorization header from the request
  const h = req.headers.authorization;
  console.log("Authorization header received:", h);

  // Check if the header exists and follows the Bearer token format
  if (!h || !h.startsWith("Bearer ")) {
    console.log("Invalid or missing Authorization header");
    return res.status(401).json({ error: "No valid authorization header provided" });
  }

  // extracting the token from the header
  const token = h.split(" ")[1];
  console.log("Token extracted:", token);

  // verifying the token
  try {
    // Decoding and verifying the token using the secret key
    const decoded = jwtoken.verify(token, process.env.JWT_S);
    console.log("JWT payload:", decoded);
    console.log("User role:", decoded.role);

    // Attach decoded user data to the request object
    req.user = decoded;

    // Proceed to the next route handler
    next();
  } catch (error) {
    // to show any errors during token verification
    console.error("Error verifying JWT:", error.message);
    return res.status(403).json({ error: "Invalid or expired token" });
  }
};

// Exporting the middleware for use in other parts
module.exports = a;