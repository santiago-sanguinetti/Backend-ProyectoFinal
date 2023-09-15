import { productModel } from "../models/products.model.js";

class ProductManagerMongo {
    addProduct = async (product, path) => {
        try {
            const thumbnail = path;
            if (
                product.title &&
                product.description &&
                product.category &&
                product.price &&
                product.stock
            ) {
                product = {
                    status: true,
                    thumbnail,
                    ...product,
                };
                const newProduct = await productModel.create(product);
                return newProduct;
            }
        } catch (error) {
            console.log(`Error adding product: ${error.message}`);
        }
    };
    getAll = async () => {
        try {
            const allProducts = await productModel.find().lean();
            return allProducts;
        } catch (error) {
            console.log(`Error getting all products: ${error.message}`);
        }
    };
    getAllPaginated = async (limit, page, sort, title = "", category = "") => {
        try {
            const search = {
                stock: { $gte: 0 },
                category: { $regex: category, $options: "i" },
                title: { $regex: title, $options: "i" },
            };
            if (sort === "asc") {
                sort = { price: 1 };
            } else if (sort === "desc") {
                sort = { price: -1 };
            }
            const options = {
                page,
                limit,
                sort,
                lean: true,
            };
            const allProducts = await productModel.paginate(search, options);
            return allProducts;
        } catch (error) {
            console.log(
                `Error obteniendo todos los productos: ${error.message}`
            );
        }
    };
    getById = async (id) => {
        try {
            const product = await productModel.findById({ _id: id });
            if (product) {
                return product;
            } else {
                throw new Error(`Product with id ${id} not found`);
            }
        } catch (error) {
            console.log(
                `Error when searching for product with the requested id: ${error.message}`
            );
        }
    };
    updateProduct = async (id, data) => {
        try {
            const productFinded = await this.getById(id);
            if (productFinded) {
                await productModel.findOneAndUpdate({ _id: id }, data);
                const updatedProduct = await this.getById(id);
                return updatedProduct;
            } else {
                throw new Error(
                    `The product with the requested ID was not found`
                );
            }
        } catch (error) {
            console.log(
                `Error when modifying product with id ${id}: ${error.message}`
            );
        }
    };
    deleteById = async (id) => {
        try {
            const deletedProduct = await this.getById(id);
            if (deletedProduct) {
                await productModel.deleteOne({ _id: id });
                return "Product removed";
            } else {
                throw new Error(`Product with ID ${id} not found`);
            }
        } catch (error) {
            console.log(
                `Error when deleting the product with the requested id: ${error.message}`
            );
        }
    };
    deleteAll = async () => {
        try {
            await productModel.deleteMany();
            return "Productos eliminados";
        } catch (error) {
            console.log(`An error occurred deleting data: ${error.message}`);
        }
    };
}

export default ProductManagerMongo;
