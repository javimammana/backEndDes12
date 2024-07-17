import { userServices } from "../services/services.js";
import { cartServices } from "../services/services.js";
import { createHash, isValidPassword } from "../utils/hashbcrypt.js";
import jwt from "jsonwebtoken";
import { createTokenPass } from "../utils/utils.js";
import { EmailManager } from "../services/email.js";

const emailManager = new EmailManager();

function capitalize(text) {
    const firstLetter = text.charAt(0);
    const rest = text.slice(1);
    return firstLetter.toUpperCase() + rest;
}


class UserController {
    
    async tokenJWT (req, res) {
        let user = req.user;
        const token = jwt.sign({
            first_name: user.first_name,
            last_name: user.last_name,
            age: user.age,
            email: user.email,
            role: user.role,
            cart: user.cart,
            favorite: user.favorite,
            chatid: user.chatid
        }, "coderhouse", {expiresIn: "15m"});
    
        res.cookie("coderCookieToken", token, {
            maxAge: 180000,
            httpOnly: true
        });
    
        res.redirect("/products")
    }

    async createUser (req, res) {
        const {first_name, last_name, email, age, password, repassword} = req.body;
        try {
            const exist = await userServices.getUserByEmail({email: email})
            if (exist) {
                req.logger.warning("(CONTROLLER) - El correo ya esta registrado")
                res.status(400).json("El correo ya esta registrado");
            }
            if (password !== repassword) {
                res.status(400).json("Las contraseñas deben ser iguales")
            }
            const cart = await cartServices.createCart();
            let newUser = {
                first_name: capitalize(first_name),
                last_name: capitalize(last_name),
                email,
                age,
                password: createHash(password),
                cart: cart._id,
                login: "local",
                chatid: ""
            }
            const user = await userServices.createUser(newUser);

            req.logger.info("(CONTROLLER) - Se crea usuario de manera exitosa");

            const token = jwt.sign({
                first_name: user.first_name,
                last_name: user.last_name,
                age: user.age,
                email: user.email,
                role: user.role,
                cart: user.cart,
                favorite: user.favorite,
                chatid: user.chatid
            }, "coderhouse", {expiresIn: "20m"});

            res.cookie("coderCookieToken", token, {
                maxAge: 180000,
                httpOnly: true
            });

            res.redirect("/profile");

        } catch (error) {
            req.logger.error("(CONTROLLER) - Error al crear Usuario")
            res.status(500).json({error: error.message});
        }
    }

    async loginUser (req, res) {
        const {email, password} = req.body;
        try {
            const user = await userServices.getUserByEmail({email: email});
            if (!user) {
                req.logger.error("(CRONTOLLER) - Usuario o contraseña incorrectos");
                //console.log ("Usuario no existe");
                return done(null, false);
            }
            if (!isValidPassword(password, user)) {
                //console.log("Contraseña incorrecta");
                req.logger.error("(CRONTOLLER) - Usuario o contraseña incorrectos");
                return done(null, false);
            }

            req.logger.info("(CONTROLLER) - Usuario Logueado OK");
            const token = jwt.sign({
                first_name: user.first_name,
                last_name: user.last_name,
                age: user.age,
                email: user.email,
                role: user.role,
                cart: user.cart,
                favorite: user.favorite,
                chatid: user.chatid
            }, "coderhouse", {expiresIn: "20m"});
    
            res.cookie("coderCookieToken", token, {
                maxAge: 180000,
                httpOnly: true
            });
    
            res.redirect("/products")

        } catch (error) {
            res.status(500).json({error: error.message});
        }
    }

    async logout (req, res) {
        try {
            res.clearCookie("coderCookieToken");
            req.logger.info("(CONTROLLER) - Cierre de sesion exitoso");
            res.redirect("/login");
        } catch (error) {
            req.logger.error("(CONTROLLER) - Error al desloguar usuario");
            res.status(500).json({error: error.message});
        }
    }

        //Recupero de Clave

    async requestPasswordReset (req, res) {

        const { email } = req.body;
        try {

            const user = await userServices.getUserByEmail({email: email});

            if (!user) {
                return res.status (404).send("Usuario no encontrado");
            }

            const token = createTokenPass();

            user.resetToken = {
                token: token,
                expire: new Date(Date.now() + 3600000)
            }

            await userServices.updateUserByEmail({email: email}, user);

            await emailManager.sendMailReset(email, user.first_name, token);

            res.redirect("/sendMailOk");


        } catch (error) {
            res.status(500).send("Error Interno del servidor al enviar token" + error);
        }
    }

    async resetPassword(req, res) {
        const {email, password, token} = req.body;

        try {
            
            const user = await userServices.getUserByEmail({email: email});

            if (!user) {
                return res.render("/passwordChange", {
                    error: "Usuario no existe",
                    title: "Restablecimiento de Contraseña",
                    fileCss: "style.css"
                })
            }

            if (!user.resetToken || user.resetToken.token !== token) {
                return res.render ("passwordChange", {
                    error: "Token invalido o caduco",
                    title: "Restablecimiento de Contraseña",
                    fileCss: "style.css"
                })
            }

            const now = new Date();
            if (now > user.resetToken.expire) {
                return res.render ("passwordChange", {
                    error: "Token invalido o caduco",
                    title: "Restablecimiento de Contraseña",
                    fileCss: "style.css"
                })
            }

            if (isValidPassword(password, user)) {
                return res.render ("passwordChange", {
                    error: "La nueva contraseña no es valida",
                    title: "Restablecimiento de Contraseña",
                    fileCss: "style.css"
                })
            }

            user.password = createHash(password);

            user.resetToken = {};

            await userServices.updateUserByEmail({email: email}, user);

            return res.redirect ("/login");

        } catch (error) {
            res.status(500).render("passwordChange", {
                error: "Error del servidor"
            })
        }
    }

}

export default UserController;