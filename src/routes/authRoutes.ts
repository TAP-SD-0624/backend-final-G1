import { Router } from "express";
import { container } from "tsyringe";
import  AuthController  from "../controllers/authController";

const authRouter = Router();
const authController = container.resolve(AuthController);

authRouter.post("/login", authController.login.bind(authController));
authRouter.post("/register", authController.register.bind(authController));
authRouter.post("/logout", authController.logout.bind(authController));

export default authRouter;