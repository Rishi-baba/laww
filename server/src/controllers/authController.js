
import User from "../models/User_Model.js";
import jwt from "jsonwebtoken";

import {
  generateAccessToken,
  generateRefreshToken
} from "../utils/tokens.js";



//Register a new user 
export const register = async (req, res) => {

  try {


    
    const { name, email ,password } = req.body;

    //Check if user already exists
    const existingUser = await User.findOne({ email });

    if(existingUser){
      return res.status(400).json({ message: "User already exists" });
    }

    //Create new user
    const user = new User({
      name,
      email,
      password,
    })
    
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save();


    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 15 * 60 * 1000,
    });


    // Refresh token cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      }       
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }

}



// Login user
export const login = async (req, res) =>{

  try {
    
    const { email, password } = req.body;

    //Check if user exists
    const user = await User.findOne({ email }).select("+password");;

    if(!user){
      return res.status(400).json({ message: "Invalid email or password" });
    }

    //Check if password is correct
    const isMatch = await user.comparePassword(password);

    if(!isMatch){
      return res.status(400).json({ message: "Invalid email or password" });
    }

    //Generate token
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 15 * 60 * 1000,
    });


    // Refresh token cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}


// Logout user
export const logout = async (req, res) => {

  try {

    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {

      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );

      const user = await User.findById(decoded.userId);

      if (user) {

        user.refreshToken = null;

        await user.save();

      }

    }

    res.clearCookie("accessToken");

    res.clearCookie("refreshToken");

    res.status(200).json({
      message: "Logged out successfully"
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};

export const refreshAccessToken = async (req, res) => {

  try {

    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {

      return res.status(401).json({
        message: "No refresh token"
      });

    }

    // Verify refresh token
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    // Find user
    const user = await User.findById(decoded.userId);

    if (!user) {

      return res.status(404).json({
        message: "User not found"
      });

    }

    // Match DB token
    if (user.refreshToken !== refreshToken) {

      return res.status(401).json({
        message: "Invalid refresh token"
      });

    }

    // Generate new access token
    const newAccessToken = generateAccessToken(user._id);

    // Send new access token
    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 15 * 60 * 1000,
    });

    res.status(200).json({
      message: "Access token refreshed"
    });

  } catch (error) {

    res.status(401).json({
      message: "Invalid refresh token"
    });

  }

};