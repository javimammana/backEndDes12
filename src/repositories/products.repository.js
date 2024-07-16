import ProductDao from "../daos/manager/dbMongo/products.mongo.js";

const productDao = new ProductDao();

class ProductRepository {

    async createProduct (data) {
        try {
            const product = await productDao.createProduct(data);
            return product;
        } catch (error) {
            console.log ("(REPOSITORY) Error al crear producto");
            return false;
        }
    }

    async getProductsPaginate (paginate) {
        try {
            const products = await productDao.getProductsPaginate(paginate);
            return products;
        } catch (error) {
            console.log("(REPOSITORY) Error al obtener productos");
            return false;
        }
    }

    async getProducts () {
        try {
            const products = await productDao.getAllProducts();
            return products;
        } catch (error) {
            console.log("(REPOSITORY) Error al obtener productos");
            return false;
        }
    }

    async getProductById (id) {
        try {
            const product = await productDao.getProductsById(id);
            return product;
        } catch (error) {
            console.log ("(REPOSITORY) Error al obtener producto", error);
            return false
            // throw new Error ("(REPOSITORY) Error al obtener producto", error);
        }
    }

    async getProductByCode (code) {
        try {
            const product = await productDao.getProductByCode(code);
            return product;
        } catch (error) {
            console.log ("(REPOSITORY) Error al obtener producto", error);
            return false
            // throw new Error ("(REPOSITORY) Error al obtener producto", error);
        }
    }

    async deleteProduct (id) {
        try {
            await productDao.deleteProduct(id);
        } catch (error) {
            console.log ("(REPOSITORY) Error al eliminar producto");
            return false;
        }
    }

    async updateProduct (id, data) {
        try {
            const product = await productDao.updateProduct(id, data);
            return product;
        } catch (error) {
            console.log ("(REPOSITORY) Error al actualizar producto");
            return false;
        }
    }
}

export default ProductRepository;