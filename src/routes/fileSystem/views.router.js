import { Router } from "express";
import { productManager_app } from "../app.js";

const router = Router();

router.get("/", async (req, res) => {
    const products = await productManager_app.getProducts();
    res.render("home", { products, title: "Home" });
});

router.get("/realtimeproducts", async (req, res) => {
    const products = await productManager_app.getProducts();
    res.render("realTimeProducts", { products, title: "Real Time Products" });
});

export default router;
