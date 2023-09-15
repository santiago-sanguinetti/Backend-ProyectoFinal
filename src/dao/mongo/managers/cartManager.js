import { cartsModel } from "../models/carts.model.js";

class CartManagerMongo {
    createCart = async () => {
        try {
            const cart = await cartsModel.create({});
            return cart;
        } catch (error) {
            console.log(`Error creating cart: ${error.message}`);
        }
    };
    deleteCart = async (id) => {
        try {
            const cart = await this.getById(id);
            if (!cart) {
                throw new Error(`No cart found with the requested id.`);
            } else {
                await cartsModel.findOneAndDelete({ _id: id });
                return "Cart successfully deleted";
            }
        } catch (error) {
            console.log(`Error deleting cart: ${error.message}`);
        }
    };
    getById = async (id) => {
        try {
            const cart = await cartsModel
                .findOne({ _id: id })
                .populate("products.product")
                .lean();
            if (!cart) {
                throw new Error(`Does not exist.`);
            } else {
                return cart;
            }
        } catch (error) {
            console.log(
                `Error looking for the cart with the requested id: ${error.message}`
            );
        }
    };
    addToCart = async (cid, pid) => {
        try {
            const cart = await cartsModel.findOneAndUpdate(
                { _id: cid, "products.product": pid },
                { $inc: { "products.$.quantity": 1 } },
                { new: true }
            );
            if (!cart) {
                const cart = await cartsModel.findOneAndUpdate(
                    { _id: cid },
                    { $addToSet: { products: { product: pid, quantity: 1 } } },
                    { new: true }
                );
                return cart;
            }
            return cart;
        } catch (error) {
            console.log(`Error adding product to cart: ${error.message}`);
        }
    };
    //updateCartProduct
    updateCartProduct = async (cid, pid, quantity) => {
        try {
            const cart = await cartsModel.findOne({
                _id: cid,
                "products.product": pid,
            });
            if (cart == null) {
                throw new Error(`Does not exist.`);
            }
            const newCart = await cartsModel.findOneAndUpdate(
                { _id: cid, "products.product": pid },
                { $set: { "products.$.quantity": quantity } },
                { new: true }
            );
            return newCart;
        } catch (error) {
            console.log(
                `Error looking cart or product whit that id: ${error.message}`
            );
        }
    };
    deleteProduct = async (cid, pid) => {
        try {
            return await cartsModel.findOneAndUpdate(
                { _id: cid },
                { $pull: { products: { product: pid } } },
                { new: true }
            );
        } catch (error) {
            console.log(`Error deleting product from cart: ${error.message}`);
        }
    };
    deleteAllProducts = async (id) => {
        try {
            const cart = await cartsModel.findOneAndUpdate(
                { _id: id },
                { $set: { products: [] } }
            );
            return cart;
        } catch (error) {
            console.log(
                `Error deleting all products from the cart: ${error.message}`
            );
        }
    };
}

export default CartManagerMongo;
