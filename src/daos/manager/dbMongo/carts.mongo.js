import { CartModel } from "../../models/cart.model.js";

class CartDao {
    async createCart (data) {
        try {
            const cart = await CartModel.create(data);
            return cart;
        } catch (error) {
            throw new Error ("(DAO) Error al crear carrito");
        }
    }

    async getCartById(id) {
        try {
            const cart = await CartModel.findById(id).populate("products.product").lean();
            return cart;
        } catch (error) {
            throw new Error ("(DAO) Error al obtener carrito");
        }
    }

    async updateCart (id, data){
        try {
            const cart = await CartModel.findByIdAndUpdate(id, data);
            return cart;
        } catch (error) {
            throw new Error ("(DAO) Error al actualizar carrito");
        }
    }

    async deleteCart (id) {
        try {
            await CartModel.findByIdAndDelete(id);
        } catch (error) {
            throw new Error ("(DAO) Error al destruir carrito");
        }
    }
}

export default CartDao;