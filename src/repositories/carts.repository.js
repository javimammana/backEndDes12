import CartDao from "../daos/manager/dbMongo/carts.mongo.js";

const cartDao = new CartDao();

class CartRepository {

    async createCart () {
        try {
            const cart = await cartDao.createCart({products: []});
            return cart;
        } catch (error) {
            console.log ("(REPOSITORY) Error al crear carrito");
            return false;
        }
    }
    async getCartById (id) {
        try {
            const cart = await cartDao.getCartById(id);
            return cart;
        } catch (error) {
            console.log ("(REPOSITORY) Error al obtener carrito");
            return false;
        }
    }

    async updateCart (id, data) {
        try {
            const cart = await cartDao.updateCart(id, data);
            return cart;
        } catch (error) {
            console.log ("(REPOSITORY) Error al actualizar carrito");
            return false;
        }
    }

    async clearCart (id) {
        try {
            const cart = await cartDao.updateCart(id, {products: []});
            return cart;
        } catch (error) {
            console.log ("(REPOSITORY) Error al vaciar carrito");
            return false;
        }
    }

    async deleteCart (id) {
        try {
            await cartDao.deleteCart(id);
        } catch (error) {
            console.log ("(REPOSITORY) Error al destruir carrito");
            return false;
        }
    }

}

export default CartRepository;