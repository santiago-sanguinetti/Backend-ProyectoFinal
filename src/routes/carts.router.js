import { Router } from "express";
import cartManager from "../dao/mongo/managers/cartManager.js";

const router = Router();
const notFound = { error: "Cart not found" };

router.post("/", async (req, res) => {
    try {
        const cart = await cartManager.createCart();
        res.status(201).send({
            status: "success",
            payload: cart,
        });
    } catch (error) {
        return console.log(error);
    }
});
router.get("/:cid", async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartManager.getById(cid);
        !cart
            ? res.status(404).send(notFound)
            : res.status(200).send({
                  status: "success",
                  payload: cart,
              });
    } catch (error) {
        return console.log(error);
    }
});

export default router;
