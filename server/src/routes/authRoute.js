import express from "express";
import { Router } from "express";

import { login, register } from "../controllers/authController.js";
import { refreshAccessToken } from "../controllers/authController.js";


Router.post("/register", register)
Router.post("/login", login)
Router.post("/refresh-token", refreshAccessToken);
export default Router;