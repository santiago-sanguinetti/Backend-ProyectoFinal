import express from "express";
import {
    addProductToCart,
    clearCart,
    completePurchase,
    createCart,
    deleteProductFromCart,
    getCartById,
    updateCartFromArray,
    updateCartProductQuantity,
} from "../controllers/carts.controller.js";
import { hasRole, verifyToken } from "../auth/middlewares.js";

const router = express.Router();

//Crear un carrito
router.post("/", createCart);
//Agregar un producto al carrito seleccionado
router.post(
    "/:cid/product/:pid",
    verifyToken,
    hasRole("usuario", "premium"),
    addProductToCart
);
//Finalizar la compra
router.post("/:cid/purchase", verifyToken, completePurchase);

//Obtener un carrito por su id
router.get("/:cid", getCartById);

//Actualizar el carrito con array de productos
router.put("/:cid", updateCartFromArray);
//Actualizar la cantidad de un producto en el carrito
router.put("/:cid/products/:pid", updateCartProductQuantity);

//Eliminar del carrito un producto
router.delete("/:cid/products/:pid", deleteProductFromCart);
//Eliminar todos los productos del carrito
router.delete("/:cid", clearCart);

export default router;
