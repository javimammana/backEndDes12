import { ProductModel } from "../../models/product.model.js";

class ProductDao {

    async createProduct (data) {
        try {
            const product =  await ProductModel.create(data);
            return product;
        } catch (error) {
            throw new Error ("(DAO) Error al crear producto");
        }
    }

    async getAllProducts () {
        try {
            const products =  await ProductModel.find();
            return products;
        } catch (error) {
            throw new Error ("(DAO) Error al obtener todos los productos");
        }
    }

    async getProductsPaginate (paginate) {
        try {
            const products = await ProductModel.paginate(paginate);
            return products;
        } catch (error) {
            throw new Error ("(DAO) Error al obtener todos los productos paginados");
        }
    }

    async getProductsById (id) {

        try {
            const product = await ProductModel.findById(id);
            if (!product){
                return {};
            }
            return product;

        } catch (error) {
            throw new Error ("(DAO) Error al obtener producto");
        }
    }

    async getProductByCode (code) {
        try {
            const product = await ProductModel.findOne(code);
            return product;
        } catch (error) {
            
        }
    }

    async deleteProduct (id) {
        try {
            await ProductModel.findByIdAndDelete(id);
        } catch (error) {
            throw new Error ("(DAO) Error al borrar producto");
        }
    }

    async updateProduct (id, data) {
        try {
            const product = await ProductModel.findByIdAndUpdate(id, data);
            return product;
        } catch (error) {
            throw new Error ("(DAO) Error al actualizar producto");
        }
    }
}

export default ProductDao;