import { Router } from "express";
import UserController from "../controllers/users.controller.js";
// import UserModel from "../models/usuario.model.js";
// import { createHash } from "../utils/hashbcrypt.js";
// import passport from "passport";
// import UserModel from "../models/user.model.js";
// import jwt from "jsonwebtoken";
// import { createHash, isValidPassword } from "../utils/hashbcrypt.js";

// import { CartManager } from "../manager/CartManager.js";


const router = Router();
const userController = new UserController();

router.post("/register", userController.createUser);
// const cartManager = new CartManager();

// router.post("/", async (req, res) => {
//     const {first_name, last_name, email, age, password, repassword} = req.body;

//     try {
//         const existUser = await UserModel.findOne({email: email});
//         if (existUser) {
//             return res.status(400).send("El correo ya esta registrado");
//         } else if(password === repassword) {
//             const newUser = await UserModel.create({
//                 first_name,
//                 last_name,
//                 email,
//                 age,
//                 password: createHash(password),
//                 role: "user"
//             })

//             req.session.user = {
//                 email: newUser.email,
//                 fisrt_name: newUser.first_name,
//                 role: newUser.role
//             }

//             req.session.loguin = true;

//             res.status(200).send("usuario creado")
//         } else {
//             return res.status(400).send("La contraseña no cohincide")
//         }
//     } catch (error) {
//         res.status(500).send("error al crear el usuario" + error)
//     }
// })

// PASSPORT - LOCAL - SESSION

// router.post ("/", passport.authenticate("register", {
//     failureRedirect: "/failedregister"
// }), async(req, res) => {
//     if (!req.user) {
//         return res.status(400).send("Credenciales invalidas");
//     }

//     req.session.user = {
//         first_name: req.user.first_name,
//         last_name: req.user.last_name,
//         age: req.user.age,
//         email: req.user.email,
//         role: req.user.role,
//         cart: req.user.cart
//     };

//     req.session.loguin = true;

//     res.redirect("/profile");
// })

// router.get("/failedregister", (req, res) => {
//     res.send("Registro Fallido");
// })
///////////////////////////////////////////////////////////////////////////
// PASSPORT - LOCAL - JWT

// router.post ("/register", async (req, res) => {

//     const {first_name, last_name, email, age, password, repassword} = req.body;

//     try {
//         const existUser = await UserModel.findOne({email: email});

//         if (existUser) {
//             return res.status(400).send("El correo ya esta registrado");
//         } else if(password === repassword) {

//             let cart = await cartManager.addCart();

//             let userNvo = {
//                 first_name,
//                 last_name,
//                 email,
//                 age,
//                 password: createHash(password),
//                 cart: cart._id,
//                 login: "local",
//                 chatid: ""
//             }

//             console.log ("usuario ok")

//             let newUser = await UserModel.create(userNvo);

//             console.log ("usuario creado")
//             const token = jwt.sign({
//                 first_name: newUser.first_name,
//                 role: newUser.role
//             }, "coderhouse", {expiresIn: "5m"});

//             res.cookie("coderCookieToken", token, {
//                 maxAge: 90000,
//                 httpOnly: true
//             });

//             res.redirect("/products")

//         } else {
//                 return res.status(400).send("La contraseña no cohincide")
//             }

//     } catch (error) {
        
//     }
// })

export default router;