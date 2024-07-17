import { Server } from "socket.io";
import ChatController from "../controllers/chats.controller.js";
import ProductController from "../controllers/products.controler.js";

const chatController = new ChatController();
const productController = new ProductController();

class SocketManager {
    constructor(httpServer) {
        this.io = new Server(httpServer);
        this.initSocketEvents();
    }
    async initSocketEvents() {
        this.io.on("connection", async (socket) => {
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
                await productController.updateProductRealTime(data);
                socket.emit("listProduct", await productController.getProductsRealTime());
                socket.emit("resultado", "Producto Actualizado"); //Aplicar la respuesta para mostrar en pantalla.-
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

    }
}

export default SocketManager;