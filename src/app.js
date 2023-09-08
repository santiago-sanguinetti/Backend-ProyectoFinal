import * as url from "url";

import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import { createServer } from "http";
import ProductManager from "./dao/ProductManager.js";
import CartManager from "./dao/CartManager.js";
import createProductsFile from "./utils/createProductsFile.js";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import mongoose from "mongoose";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

const app = express();
const port = process.env.PORT || 8080;

export const productManager_app = new ProductManager(
    `${__dirname}/dao/products.json`
);
export const cartManager_app = new CartManager(`${__dirname}/dao/carts.json`);

createProductsFile(productManager_app);

// Configuración de mongoose
mongoose.connect(
    "mongodb+srv://CoderUser:00UIDh6iSAQPHj28@ecommerce.dn98uin.mongodb.net/?retryWrites=true&w=majority"
);

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
io.on("connection", (socket) => {
    console.log("New client connected!!!");

    const getProducts = async () => {
        const products = await productManager_app.getProducts();
        socket.emit("realTimeProducts", products);
        socket.emit("connection:sid", socket.id);
    };
    getProducts();
});
httpServer.listen(port, () => {
    console.log(`Server ON - http://localhost:${port}`);
});

app.use((req, res, next) => {
    req.io = io;
    next();
});
