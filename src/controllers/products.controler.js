import { productServices, userServices } from "../services/services.js";
import CustomError from "../services/errors/custom-error.js";
import { EErrors } from "../services/errors/enum.js";
import { infoErrorCode, infoErrorItem, infoErrorProducto } from "../services/errors/info.js";
import { EmailManager } from "../services/email.js";

const emailManager = new EmailManager();



class ProductController {

    async createProduct (req, res, next) {

        const {title, description, price, code, stock, category} = req.body;

        try {
            if( !title || !description || !price || !code || !stock || !category ) {
                req.logger.fatal("(CONTROLLER) - El producto esta incompleto, no se procesa")
                throw CustomError.crearError({
                    nombre: "Producto Incompleto",
                    causa: infoErrorProducto({title, description, price, code, stock, category}),
                    mensaje: "Error al crear producto",
                    codigo: EErrors.TIPO_INVALIDO
                });
            } 

            const prodCode = await productServices.getProductByCode({code: code});

            if (prodCode) {
                req.logger.error("(CONTROLLER) - El codigo de producto ya existe, no puede repetirse");
                throw CustomError.crearError({
                    nombre: "CODE existente",
                    causa: infoErrorCode(prodCode.code),
                    mensaje: "El codigo ingresado ya existe con otro producto",
                    codigo: EErrors.INFORMACION_REPETIDA
                });
            }

            const newProduct = {
                ...req.body,
                img: req.body.img || "sinImg.png"
            };

            const product = await productServices.createProduct(newProduct);
            req.logger.info("(CONTROLLER) - El producto se creo con exito");
            res.json(product);
        } catch (error) {
            next(error);
        }
    }

    async getProducts (req, res) {
        try {
            const products = await productServices.getProducts();
            res.json(products)
            return;
        } catch (error) {
            console.log(error)
            res.status(500).json({error: error.message});
        }
    }

    async getProductsPaginate (req, res) {
        try {
            const limit = req.query.limit || 10;
            const filtro = req.query.query ? {category: req.query.query} : {};
            const sort = req.query.sort ? {price: Number(req.query.sort)} : {};
            const page = req.query.page || 1;
            const products = await productServices.getProductsPaginate(filtro, {limit: limit, page: page, sort: sort});

            res.json({
                status:"success",
                payload: products.totalDocs,
                totalPages: products.totalPages,
                prevPage: products.prevPage,
                nextPage: products.nextPage,
                page: products.page,
                hasPrevPage: products.hasPrevPage,
                hasNextPage: products.hasNextPage,
                prevLink: products.hasPrevPage ? `/api/products?page=${products.prevPage}&&limit={{productos.limit}}&query={{query}}&sort={{sort}}` : null,
                nextLink: products.hasNextPage ? `/api/products?page=${products.nextPage}&&limit={{productos.limit}}&query={{query}}&sort={{sort}}` : null,
            })
        } catch (error) {
            res.status(500).json({error: error.message});
        }
    }

    async getProductById (req, res) {
        const { pid } = req.params;
        try {
            let product = await productServices.getProductById(pid);
            res.json(product); 

        } catch (error) {
            res.status(500).json({error: error.message});
        }
    }

    async deleteProduct (req, res) {
        const { pid } = req.params;
        try {
            await productServices.deleteProduct(pid);
            req.logger.info("(CONTROLLER) - El producto se elimino correctamente");
            res.json ({message: "Producto eliminado"});
        } catch (error) {
            req.logger.error("(CONTROLLER) - Error al eliminar producto")
            res.status(500).json({error: error.message});
        }
    }

    async notifyProducto (req, res) {
        const { pid, uid } = req.params;

        try {
            const product = await productServices.getProductById(pid);

            if (!product) {
                req.logger.fatal("(CONTROLLER) - El producto no existe");
                throw CustomError.crearError({
                    nombre: "Producto inexistente",
                    causa: infoErrorItem(pid),
                    mensaje: "El prodcuto no existe",
                    codigo: EErrors.ITEM_INVALIDO
                });
            }

            if (product.stock !== 0) {
                req.logger.fatal("(CONTROLLER) - El producto tiene stock");
                res.json(product);
            }

            if (product.owner === uid) {
                req.logger.fatal("(CONTROLLER) - No podemos notificar stock de tus productos");
                res.json(product);
            }


            if (!product.notify.includes(uid)) {
                product.notify.push(uid);
                await productServices.updateProduct(pid, product);
            }

            req.logger.info("(CONTROLLER) - Se agrego usuario para ser notificado de stock");
            res.redirect("/products")

        } catch (error) {
            req.logger.error("(CONTROLLER) - Error al cargar notificacion de producto")
            res.status(500).json({error: error.message});
        }
    }

    async favoriteProduct (req, res) {
        const { pid, uid } = req.params;

        try {
            console.log("producto" + pid);
            console.log("usuario" + uid)
            const user = await userServices.getUserByEmail({email: uid});
            if(!user) {
                return res.status(404).send("Usuario no encontrado")
            }

            const exist = user.favorite.find(item => item === pid);
            if (exist) {
                user.favorite.splice(user.favorite.indexOf(exist),1);
            } else {
                user.favorite.push(pid);
            }

            await userServices.updateUserByEmail({email: uid}, user);

            const userNvo = await userServices.getUserByEmail({email: uid});

            console.log(userNvo)

            req.logger.info("(CONTROLLER) - Se agrego producto a favoritos");
            res.redirect("/products")
        } catch (error) {
            req.logger.error("(CONTROLLER) - Error al marcar favorito el producto")
            res.status(500).json({error: error.message});
        }
    }

    async updateProduct (req, res, next) {
        const { pid } = req.params;
        const {title, description, price, stock, category} = req.body;

        try {
            const product = await productServices.getProductById(pid);

            if (!product) {
                req.logger.fatal("(CONTROLLER) - El producto no existe");
                throw CustomError.crearError({
                    nombre: "Producto inexistente",
                    causa: infoErrorItem(pid),
                    mensaje: "El prodcuto no existe",
                    codigo: EErrors.ITEM_INVALIDO
                });
            }

            const code = product.code

            if( !title || !description || !price || !code || !stock || !category ) {
                req.logger.fatal("(CONTROLLER) - Datos de producto para actualizar incompletos");
                throw CustomError.crearError({
                    nombre: "Producto Incompleto",
                    causa: infoErrorProducto({title, description, price, code, stock, category}),
                    mensaje: "Error al crear producto",
                    codigo: EErrors.TIPO_INVALIDO
                });
            } 

            const updateProduct = {
                ...req.body,
                code: code,
                img: req.body.img || "sinImg.png"
            };

            await productServices.updateProduct(pid, updateProduct);
            req.logger.info("(CONTROLLER) - El producto de actualizo de manera exitosa")
            res.json(product);
        } catch (error) {
            req.logger.error("(CONTROLLER) - Error al actualizar producto")
            next(error);
        }
    }

    async deleteProductRealTime (data) {
        try {
            await productServices.deleteProduct(data);
            console.log("Producto Eliminado")
        } catch (error) {
            console.log(error)
            throw new Error ("(CONTROLLER) Error al borrar productosRealTime");

        }
    }

    async getProductsRealTime () {
        try {
            const products = await productServices.getProducts();
            return products;
        } catch (error) {
            console.log(error)
            throw new Error ("(CONTROLLER) Error al obtener productosRealTime");
        }
    }
    async createProductRealTime (data) {

        try {
            const product = await productServices.createProduct(data);
            console.log(product)
            return product;
        } catch (error) {
            console.log(error)
            throw new Error ("(CONTROLLER) Error al crear productosRealTime");
        }
    }

    async updateProductRealTime (data) {
        try {
            let { id, stock, price } = data;
            const product = await productServices.getProductById(id);

            if (!stock) {
                stock = product.stock
            }
            if (!price) {
                price = product.price;
            }
            const nvoProd = {
                ...product._doc,
                stock: stock,
                price: price
            }

            if (product.stock === 0 && nvoProd.stock > 0) {
                for (let mail of product.notify) {
                    let usuario = await userServices.getUserByEmail({email: mail});
                    await emailManager.sendMailStock(mail, usuario.first_name, nvoProd);
                }
                nvoProd.notify = [];
            }

            await productServices.updateProduct(id, nvoProd);

            return;
        } catch (error) {
            console.log(error)
            throw new Error ("(CONTROLLER) Error al actualizar productosRealTime");
        }
    }
}

export default ProductController;