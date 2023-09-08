import fs from "fs";

class CartManager {
    constructor(path) {
        this.carts = [];
        this.nextCartId = 1;
        this.path = path;
    }

    async addCart(products) {
        const newCart = {
            id: this.nextCartId,
            products: products || [],
        };

        this.carts.push(newCart);
        this.nextCartId++;
        await this.writeCartsToFile(this.carts);
    }

    async getCarts() {
        try {
            const fileContent = await fs.promises.readFile(this.path, "utf-8");
            return JSON.parse(fileContent);
        } catch (error) {
            console.error(
                "Error al leer el archivo de carritos:",
                error.message
            );
            return [];
        }
    }

    async getCartById(id) {
        const carts = await this.getCarts();
        if (Array.isArray(carts)) {
            const cartIndex = carts.findIndex((p) => p.id === id);
            if (cartIndex < 0) {
                return "Not found";
            }
            return carts[cartIndex];
        }
    }

    async writeCartsToFile(carts) {
        try {
            await fs.writeFileSync(this.path, JSON.stringify(carts, null, 2));
        } catch {
            console.error("Error al escribir el archivo.");
        }
    }

    async updateCart(cartId, updatedCart) {
        try {
            const carts = await this.getCarts();

            const cartIndex = carts.findIndex((cart) => cart.id === cartId);

            if (cartIndex < 0) {
                return "Not found";
            }

            carts[cartIndex] = updatedCart;

            await this.writeCartsToFile(carts);
            console.log("Carrito actualizado con éxito.");
        } catch (error) {
            console.error("Error al actualizar el carrito:", error.message);
        }
    }
}

export default CartManager;
