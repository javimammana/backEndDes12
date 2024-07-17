import { faker } from "@faker-js/faker";

export function validate (req, res, next) {
    const {title, description, price, code, stock, category} = req.body;
    
    if (!title) {
        return res.json ({
            error: "El Nombre del producto es necesario"
        })
    }

    if (!description) {
        return res.json ({
            error: "La Descripcion del producto es necesaria"
        })
    }

    if (!price) {
        return res.json ({
            error: "El precio del producto es necesario"
        })
    }

    if (!code) {
        return res.json ({
            error: "El codigo del producto es necesario"
        })
    }
    if (!stock) {
        return res.json ({
            error: "El stock de productos es necesario"
        })
    }

    if (!category) {
        return res.json ({
            error: "La categoria de producto es necesaria"
        })
    }

    next();
}

import configObject from "../config/configEnv.js";
import jwt from "jsonwebtoken";

const admin = {
    email: configObject.user,
    password: configObject.pass
};
export function adminLoginJWT (req, res, next) {
    const {email, password} = req.body;
    if (email === admin.email) {
        if (password === admin.password) {

            const token = jwt.sign({
                first_name: "Coder",
                last_name: "House",
                // age: usuario.age,
                email: admin.email,
                role: "ADMIN",
                admin: true,
                // cart: usuario.cart,
                // favorite: usuario.favorite,
                chatid: "ADMIN"
            }, "coderhouse", {expiresIn: "20m"});
    
            res.cookie("coderCookieToken", token, {
                maxAge: 180000,
                httpOnly: true
            });

                res.redirect("/realtimeproducts");
                return
        
        } else { 
            res.status(401).send("usuario o contraseña incorrecto") 
            return
        }
    }
    next();
}

export function createTokenPass() {
    let token = Math.floor(100000 + Math.random() * 900000);
    return token.toString();
}


let code = 0;
export const generarProductos = () => {

    code ++;

    return {
        _id: faker.database.mongodbObjectId(),
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: parseFloat(faker.commerce.price()).toFixed(2),
        img: "sinImg.png",
        thumbnail: [],
        status: true,
        category: faker.commerce.product().toUpperCase(),
        stock: Number(faker.string.numeric()),
        code: `PRO${code}`,
    }
}

const checkRole = (roles) => async (req, res, next) => {
    const user = req.user;
    if (![].concat(roles).includes(user.role)) {
        // return res.status(403).send("Sin permiso para esta area").render();
        return res.redirect("/restricted");
    }
    next()
}

export {checkRole};
