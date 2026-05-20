import express from "express";
import { Router } from "express";

import { login, register } from "../controllers/authController.js";
import { refreshAccessToken } from "../controllers/authController.js";
import { forgotPassword } from "../controllers/authController.js";
import { resetPassword } from "../controllers/authController.js";


Router.post("/register", register)
Router.post("/login", login)
Router.post("/refresh-token", refreshAccessToken);
Router.post("/forgot-password", forgotPassword);
Router.put("/reset-password/:token", resetPassword);

export default Router;