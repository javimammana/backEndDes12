import { Router } from "express";
import passport from "passport";

import ViewController from "../controllers/views.controller.js";
import { checkRole } from "../utils/utils.js";


const router = Router();
const viewController = new ViewController();

router.get("/", viewController.viewHome);
router.get("/products", passport.authenticate("jwt", {session: false, failureRedirect: "/login"}), checkRole(['USER', 'PREMIUM']), viewController.viewProductsPaginate);
router.get ("/product/:pid", passport.authenticate("jwt", {session: false, failureRedirect: "/login"}), checkRole(['USER', 'PREMIUM']), viewController.viewProductById);
router.get("/carts", passport.authenticate("jwt", {session: false, failureRedirect: "/login"}), checkRole(['USER', 'PREMIUM']), viewController.viewCart);
router.get("/favorites", passport.authenticate("jwt", {session: false, failureRedirect: "/login"}), checkRole(['USER', 'PREMIUM']), viewController.viewFavorite);
router.get("/users", passport.authenticate("jwt", {session: false, failureRedirect: "/login"}), checkRole(['ADMIN']), viewController.viewUsers);
router.get("/realtimeproducts", passport.authenticate("jwt", {session: false, failureRedirect: "/login"}), checkRole(['ADMIN', 'PREMIUM']), viewController.viewRealTimeProducts);
router.get("/carts/:tid/checkout", passport.authenticate("jwt", {session: false, failureRedirect: "/login"}), checkRole(['USER', 'PREMIUM']), viewController.viewCheckOut);
router.get("/buys/:tid", passport.authenticate("jwt", {session: false, failureRedirect: "/login"}), checkRole(['USER', 'PREMIUM']), viewController.viewBuys);

router.get("/resetPassword", viewController.viewResetPassword);
router.get("/password", viewController.viewChargePassword);
router.get("/sendMailOk", viewController.viewSendMailReset);

//CHAT//
router.get ("/messages", passport.authenticate("jwt", {session: false, failureRedirect: "/login"}), checkRole(['USER']), viewController.viewMessages);

router.get("/login", viewController.viewLogin);
router.get("/register", viewController.viewRegister);
router.get("/profile", passport.authenticate("jwt", {session: false, failureRedirect: "/login"}), viewController.viewProfile);
router.get("/restricted", passport.authenticate("jwt", {session: false, failureRedirect: "/login"}), viewController.viewRestricted);

router.get("/mockingproducts", viewController.mockingproducts)


export default router;