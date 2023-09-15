import mongoose from "mongoose";

const collection = "carts";

const cartsSchema = new mongoose.Schema({
    products: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: "products" },
            quantity: { type: Number },
            _id: false,
        },
    ],
});

export const cartsModel = mongoose.model(collection, cartsSchema);
