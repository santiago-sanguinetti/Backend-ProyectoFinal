import { cartManager_app } from "../../app.js";
import { Router } from "express";
const router = Router();

router.post("/", (req, res) => {
    const products = req.body.products;

    cartManager_app.addCart(products);

    return res.status(201).json({ message: "Carrito creado con éxito." });
});

router.post("/:cid/product/:pid", async (req, res) => {
    const cartId = +req.params.cid;
    const productId = +req.params.pid;

    if (isNaN(cartId) || isNaN(productId)) {
        return res.status(400).send("Los IDs deben ser números válidos.");
    }

    const cart = await cartManager_app.getCartById(cartId);

    if (cart === "Not found") {
        return res.status(404).send("Carrito no encontrado");
    }

    const existingProduct = cart.products.find(
        (product) => product.product === productId
    );

    if (existingProduct) {
        existingProduct.quantity++;
    } else {
        cart.products.push({
            product: productId,
            quantity: 1,
        });
    }

    try {
        await cartManager_app.updateCart(cartId, cart);
        res.send(cart);
    } catch (error) {
        console.error("Error al agregar producto al carrito:", error.message);
        res.status(500).send("Error al agregar producto al carrito.");
    }
});

router.get("/", async (req, res) => {
    const limit = +req.query.limit;
    try {
        const carts = await cartManager_app.getCarts();
        if (!isNaN(limit)) {
            const limitedCarts = carts.slice(0, limit);
            return res.send(limitedCarts);
        } else {
            return res.send(carts);
        }
    } catch {
        res.status(500).send("Error al obtener los carritos");
    }
});

router.get("/:cid", async (req, res) => {
    const cartId = +req.params.cid;

    if (isNaN(cartId)) {
        return res
            .status(400)
            .send("El ID del carrito debe ser un número válido.");
    }

    try {
        const cart = await cartManager_app.getCartById(cartId);

        if (cart === "Not found") {
            return res.status(404).send("Carrito no encontrado");
        }

        res.send(cart.products);
    } catch (error) {
        console.error("Error al obtener el carrito:", error.message);
        res.status(500).send("Error al obtener el carrito.");
    }
});

export default router;
