import * as url from "url";
import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import { createServer } from "http";
import { chatManager } from "./dao/mongo/managers/chat.js";
import ProductManager from "./dao/mongo/managers/productManager.js";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import mongoose from "mongoose";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

const app = express();
const port = process.env.PORT || 8080;

mongoose.connect(
    "mongodb+srv://CoderUser:00UIDh6iSAQPHj28@ecommerce.dn98uin.mongodb.net/?retryWrites=true&w=majority"
);

const productsList = new ProductManager(`${__dirname}/db/products.json`);

// Configuración de Express
app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", `${__dirname}/views`);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));

// Configuración de las rutas
app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

// Configuración de Socket.IO
const httpServer = createServer(app);
const io = new Server(httpServer);
app.set("io", io);
io.on("connection", async (socket) => {
    console.log("Nuevo cliente conectado", socket.id);
    const messages = await chatManager.getMessages();
    socket.on("client:productDelete", async (pid, cid) => {
        const id = await productsList.getProductById(parseInt(pid.id));
        if (id) {
            await productsList.deleteById(parseInt(pid.id));
            const data = await productsList.getProducts();
            return io.emit("newList", data);
        }
        const dataError = { status: "error", message: "Product not found" };
        return socket.emit("newList", dataError);
    });
    socket.on("client:newProduct", async (data) => {
        console.log(data.thumbnail);
        const imgPaths = data.thumbnail;
        const productAdd = await productsList.addProduct(data, imgPaths);
        console.log(productAdd);
        if (productAdd.status === "error") {
            let errorMess = productAdd.message;
            socket.emit("server:producAdd", { status: "error", errorMess });
        }
        const newData = await productsList.getProducts();
        return io.emit("server:productAdd", newData);
    });
    //chat
    socket.emit("messages", messages);
    socket.on("newMessage", async (data) => {
        await chatManager.addMessages(data);
        const newMessageList = await chatManager.getMessages();
        io.emit("messages", newMessageList);
    });
    socket.on("cart", async (id) => {
        const cart = await cartManager.getById(id);
        socket.emit("cart", cart);
    });
});
httpServer.listen(port, () => {
    console.log(`Server ON - http://localhost:${port}`);
});

app.use((req, res, next) => {
    req.io = io;
    next();
});
