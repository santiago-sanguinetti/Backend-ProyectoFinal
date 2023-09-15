import fs from "fs";

class ProductManager {
    constructor(path) {
        this.products = [];
        this.nextProductId = 1;
        this.path = path;
    }

    async addProduct(
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnails
    ) {
        const newProduct = {
            id: this.nextProductId,
            title,
            description,
            code,
            price,
            status,
            stock,
            category,
            thumbnails,
        };

        if (this.products.find((p) => p.code === newProduct.code)) {
            console.error("Ya existe un producto con el mismo código.");
            return;
        }

        this.products.push(newProduct);
        this.nextProductId++;

        await this.writeProductsToFile(this.products);
    }

    async getProducts() {
        try {
            const fileContent = await fs.promises.readFile(this.path, "utf-8");
            return JSON.parse(fileContent);
        } catch (error) {
            console.error(
                "Error al leer el archivo de productos:",
                error.message
            );
            return [];
        }
    }

    async getProductById(id) {
        const products = await this.getProducts();
        if (Array.isArray(products)) {
            const productIndex = products.findIndex((p) => p.id === id);
            if (productIndex < 0) {
                return "Not found";
            }
            return products[productIndex];
        }
    }

    async updateProduct(id, fieldsToChange) {
        try {
            const products = await this.getProducts();

            const productIndex = products.findIndex((p) => p.id === id);

            if (productIndex < 0) {
                return "Not found";
            }

            products[productIndex] = {
                ...products[productIndex],
                ...fieldsToChange,
            };

            await this.writeProductsToFile(products);
            console.log("Producto actualizado con éxito.");
        } catch (error) {
            console.error("Error al actualizar el producto:", error.message);
        }
    }

    async deleteProduct(id) {
        try {
            const products = await this.getProducts();

            const productIndex = products.findIndex((p) => p.id === id);

            if (productIndex < 0) {
                return "Not found";
            }

            products.splice(productIndex, 1);

            await this.writeProductsToFile(products);
            console.log("Producto eliminado con éxito.");
        } catch (error) {
            console.error("Error al eliminar el producto:", error.message);
        }
    }

    async writeProductsToFile(products) {
        try {
            await fs.writeFileSync(
                this.path,
                JSON.stringify(products, null, 2)
            );
        } catch (error) {
            console.error("Error al escribir el archivo.", error.message);
        }
    }
}

export default ProductManager;
