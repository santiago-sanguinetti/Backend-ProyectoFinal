import { productManager_app } from "../app.js";
import { Router } from "express";
import { productModel } from "../dao/models/products.model.js";
import mongoose from "mongoose";
const router = Router();

router.get("/", async (req, res) => {
    const limit = +req.query.limit;
    try {
        const products = await productManager_app.getProducts();
        if (!isNaN(limit)) {
            const limitedProducts = products.slice(0, limit);
            return res.send(limitedProducts);
        } else {
            return res.send(products);
        }
    } catch {
        res.status(500).send("Error al obtener los productos");
    }
});

router.get("/:pid", async (req, res) => {
    const productId = +req.params.pid;

    if (isNaN(productId)) {
        return res
            .status(400)
            .send("El ID del producto debe ser un número válido.");
    }

    try {
        const product = await productManager_app.getProductById(productId);
        if (product === "Not found") {
            return res.status(404).send("Producto no encontrado.");
        }

        return res.send(product);
    } catch {
        res.status(500).send("Error al obtener el producto.");
    }
});

router.post("/", async (req, res) => {
    const {
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnails,
    } = req.body;

    if (!title || !description || !code || !price || !stock || !category) {
        return res.status(400).json({ error: "Campos obligatorios faltantes" });
    }

    try {
        let productData = await productModel.create({
            title,
            description,
            code,
            price,
            status, // status || true,
            stock,
            category,
            thumbnails, // thumbnails || [],
        });
        res.send({ status: "success", payload: productData });

        await productManager_app.addProduct(productData);
        // return res
        //     .status(201)
        //     .json({ message: "Producto agregado con éxito." });
    } catch (error) {
        console.error("Error al agregar un producto:", error);
        res.status(500).json({ error: "Error al agregar un producto." });
    }
});

router.put("/:pid", async (req, res) => {
    const pid = +req.params.pid;
    const updatedFields = req.body;

    const existingProduct = productManager_app.getProductById(pid);

    if (existingProduct === "Not found") {
        return res.status(404).json({ error: "Producto no encontrado" });
    }

    const updatedProduct = {
        ...existingProduct,
        ...updatedFields,
    };

    await productManager_app.updateProduct(pid, updatedProduct);

    return res.status(200).json({ message: "Producto actualizado con éxito." });
});

router.delete("/:pid", async (req, res) => {
    const pid = +req.params.pid;

    const existingProduct = productManager_app.getProductById(pid);

    if (existingProduct === "Not found") {
        return res.status(404).json({ error: "Producto no encontrado" });
    }

    await productManager_app.deleteProduct(pid);

    return res.status(200).json({ message: "Producto eliminado con éxito." });
});

export default router;
