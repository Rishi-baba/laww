import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Middleware to protect routes
export const protect = async (req, res, next) => {

  try {
    
     let token;

    // Token from cookies
    if (req.cookies.token) {
      token = req.cookies.token;
    }


    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

      
    req.user = await User.findById(decoded.id);
    
    if (!req.user) {
      return res.status(401).json({
        message: "User not found",
      });
    }
  
    next();

  } catch (error) {
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
}

