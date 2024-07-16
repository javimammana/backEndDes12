import passport from "passport";
import GitHubStrategy from "passport-github2";
import jwt from "passport-jwt";
import { userServices } from "../services/services.js";

import { cartServices } from "../services/services.js";

const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;


const initializePassport = () => {

    passport.use("jwt", new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: "coderhouse"
    }, async (jwt_playLoad, done) => {
        try {
            return done (null, jwt_playLoad);
        } catch (error) {
            return done(error);
        }
    }))

    // login con GITHUB

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async(id, done) => {
        let user = await userServices.getUserById(id);
        done(null, user);
    })

    passport.use("github", new GitHubStrategy({
        clientID: "Iv23lia8BR4hBVTjbQEr",
        clientSecret: "2636fa4beda93965506a51fac12befa589a8e24a",
        callbackURL: "http://localhost:8080/api/sessions/githubcallback"
    }, async (accessToken, refreshToken, profile, done) => {

        try {
            let usuario = await userServices.getUserByEmail({email:profile._json.email})

            if (!usuario) {
                let cart = await cartServices.createCart();
                let userNvo = {
                    first_name: profile._json.name,
                    last_name: "",
                    age: "",
                    email: profile._json.email,
                    password: "",
                    login: "github",
                    cart: cart._id,
                    chatid: ""
                }

                let result = await userServices.createUser(userNvo);
                done(null, result)
            } else {
                done (null, usuario);
            }
        } catch (error) {
            return done(error);
        }
    }))
}

const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies["coderCookieToken"]
    }
    return token;
}

export default initializePassport;