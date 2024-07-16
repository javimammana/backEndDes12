import express from "express";
import exphbs from "express-handlebars";
import { Server } from "socket.io";
import multer from "multer";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";

//base de datos
import "./dataBase.js";
import configObject from "./config/configEnv.js";

import productRouter from "./routes/products.routes.js"
import cartRouter from "./routes/carts.routes.js";
import viewsRouter from "./routes/views.routes.js";
import sessionRouter from "./routes/sessions.routes.js";
import initializePassport from "./config/passport.config.js";
import userRouter from "./routes/users.routes.js";
import manejadorError from "./middleware/error.js";

import addLogger from "./utils/logger.js";

import ChatController from "./controllers/chats.controller.js";
import ProductController from "./controllers/products.controler.js";
const chatController = new ChatController();
const productController = new ProductController();


const app = express();
const PORT = configObject.puerto;
const claveCookie = "CamareroDesencamaronemelo";

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./src/public"));
app.use(cookieParser(claveCookie));
app.use(session({
    secret: "secretClave",
    resave: true, //mantien activa la sesion frente a la inactividad del ususario
    saveUninitialized: true, //permite guardar sesion aun cuando este vacio
    store: MongoStore.create({
        mongoUrl: configObject.mongo_url,
        ttl: 60 * 5
    })
}));
app.use(passport.initialize());
app.use(passport.session());
initializePassport();

//Configuramos Multer: 
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./src/public/img/productos");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
app.use(multer({storage}).single("image"));


//Handlebars
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

//LOGER//
app.use(addLogger);

app.get("/loggerTest", (req, res) => {
    req.logger.debug("Mensaje DEBUG");  
    req.logger.http("Mensaje HTTP"); 
    req.logger.info("Mensaje INFO"); 
    req.logger.warning("Mensaje WARNING"); 
    req.logger.error("Mensaje ERROR"); 
    req.logger.fatal("Mensaje FATAL"); 

    res.send("Logs generados");
})


 //Rutas
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/", viewsRouter);
app.use("/api/sessions", sessionRouter);
app.use("/api/users", userRouter);

//Middleware de Errores
app.use(manejadorError);


//Servidor
const httpServer = app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));


//Socket
const  io = new Server(httpServer);

io.on("connection", async (socket) => {
    console.log ("Un cliente se conecta a PROD");

    //Productos en tiempo real.-
    socket.emit("listProduct", await productController.getProductsRealTime());

    socket.on("deleteProduct", async (data) => {
        await productController.deleteProductRealTime(data);
        socket.emit("listProduct", await productController.getProductsRealTime());
    });

    socket.on("addForForm", async (data) => {
        let resultado = await productController.createProductRealTime(data);
        if(resultado) {
            resultado = `${resultado.title}, se agrego a tus productos!`
        } else {
            resultado= "Producto incompleto"
        }
        socket.emit("listProduct", await productController.getProductsRealTime());
        socket.emit("resultado", resultado); //Aplicar la respuesta para mostrar en pantalla.-
    });

    socket.on("updateProduct", async (data) => {
        console.log("update desde back")
        console.log(data);
        const resultado = await productController.updateProductRealTime(data);
        socket.emit("listProduct", await productController.getProductsRealTime());
        socket.emit("resultado", resultado); //Aplicar la respuesta para mostrar en pantalla.-
    });

    //CHAT!

    const messages = await chatController.getAllMessages();
    console.log("Nuevo usuario conectado al CHAT");

    socket.on("message", async (data) => {
        // console.log(data);
        await chatController.sendMessage(data);
        const messages = await chatController.getAllMessages();
        io.emit("messages", messages);
    });

    socket.on("inicio", async (data) => {
        const messages = await chatController.getAllMessages();
        io.emit("messages", messages);
        socket.broadcast.emit("connected", data);
    });

    socket.emit("messages", messages);
})





