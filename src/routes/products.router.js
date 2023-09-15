import { Router } from "express";
import productManager from "../dao/mongo/managers/productManager.js";

const router = Router();
router.get("/", async (req, res) => {
    try {
        const products = await productManager.getAll();
        res.render("products", {
            products,
        });
    } catch (error) {
        console.log(error);
    }
});

export default router;
