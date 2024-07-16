import { Router } from "express";
import passport from "passport";
import UserController from "../controllers/users.controller.js";
import { adminLoginJWT } from "../utils/utils.js";


const router = Router();
const userController = new UserController();

// PASSPORT - LOCAL - JWT

router.post("/login", adminLoginJWT, userController.loginUser);

// PASSPORT GITHUB

router.get("/github", passport.authenticate("github", {scope: ["user:email"]}), async(req, res) => { })

router.get("/githubcallback", passport.authenticate("github", {
    failureRedirect: "/login"
}), userController.tokenJWT)

router.get("/logout", userController.logout);

export default router;