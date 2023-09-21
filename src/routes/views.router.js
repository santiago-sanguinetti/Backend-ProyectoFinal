import { Router } from "express";
import mongoose from "mongoose";
import { productModel } from "../dao/models/products.model.js";
import { cartModel } from "../dao/models/carts.model.js";

const router = Router();

router.get("/", async (req, res) => {
    // try {
    //     const limit = parseInt(req.query.limit) || 10; // Si no se proporciona un límite, se establece un valor predeterminado
    //     const products = await productModel.find().limit(limit).lean();
    //     res.render("home", { products });
    // } catch (err) {
    //     res.status(500).json({ message: err.message });
    // }
    res.redirect("/login");
});

router.get("/realtimeproducts", async (req, res) => {
    try {
        const products = await productModel.find().lean();
        res.render("realTimeProducts", { products });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get("/products", checkAuth, async (req, res) => {
    const limit = Number(req.query.limit) || 10;
    const page = Number(req.query.page) || 1;

    try {
        const products = await productModel
            .find()
            .lean()
            .limit(limit)
            .skip((page - 1) * limit)
            .exec();

        const totalProducts = await productModel.countDocuments().exec();
        const totalPages = Math.ceil(totalProducts / limit);
        const prevPage = page > 1 ? page - 1 : null;
        const nextPage = page < totalPages ? page + 1 : null;
        res.render("products", {
            user: req.session.user,
            products: products,
            totalPages: totalPages,
            prevPage: prevPage,
            nextPage: nextPage,
            page: page,
            hasPrevPage: prevPage !== null,
            hasNextPage: nextPage !== null,
            prevLink: prevPage
                ? `/productos?page=${prevPage}&limit=${limit}`
                : null,
            nextLink: nextPage
                ? `/productos?page=${nextPage}&limit=${limit}`
                : null,
        });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.get("/cart", async (req, res) => {
    //Por ahora funciona con un solo carrito luego funcionará con :cid
    const { cid } = req.params;

    try {
        const cart = await cartModel
            .findById("650a07c3860aebb9f03b2e69") //cid
            .populate("products.productId")
            .lean();
        // console.log(JSON.stringify(cart, null, 2));
        res.render("cart", { cart: cart });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

//-------------------- Login --------------------
export function checkAuth(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.redirect("/login");
    }
}

export function checkNotAuth(req, res, next) {
    if (req.session.user) {
        res.redirect("/profile");
    } else {
        next();
    }
}

router.get("/login", checkNotAuth, (req, res) => {
    res.render("login");
});

router.get("/register", checkNotAuth, (req, res) => {
    res.render("register");
});

router.get("/profile", checkAuth, (req, res) => {
    res.render("profile", { user: req.session.user });
});

router.post("/logout", checkAuth, (req, res) => {
    req.session.destroy();
    res.redirect("/login");
});

export default router;
