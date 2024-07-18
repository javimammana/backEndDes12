import { parse } from "dotenv";
import { productServices, userServices, cartServices, chatServices, ticketServices } from "../services/services.js";
import { generarProductos } from "../utils/utils.js";

// import configObject from "../config/configEnv.js";

class ViewController {

    async viewHome (req, res) {
        try {
            if (!req.user) {
                return res.redirect("/login");
            }
            const user = req.user
            const products = await productServices.getProducts();
            res.render("home", {
                title: "Productos",
                fileCss: "style.css",
                products,
                user
            });
        } catch (error) {
            res.status(500).json({error: "Error del servicor al Renderizar Home"});
        }
    }

    async viewProductsPaginate (req, res) {
        try {
            if (!req.user) {
                return res.redirect("/login");
            }
            const user = req.user
            // console.log(user);
            const limit = req.query.limit || 10;
            const filtro = req.query.query ? {category: req.query.query} : {};
            const sort = req.query.sort ? {price: Number(req.query.sort)} : {};
            const page = req.query.page || 1;
            const products = await productServices.getProductsPaginate(filtro, {limit: limit, page: page, sort: sort});
            const userFav = await userServices.getUserByEmail({email: user.email});
    
            let elementos = products.docs.map(prod => {
                const correctPrice = {
                    ...prod.toObject(),
                    price: prod.price.toFixed(2),
                    notifyUser: prod.notify.includes(user.email),
                    favorite: userFav.favorite.includes(prod._id)
                };
                return correctPrice;
            });
    
            const pages = []
    
            if (products.totalPages != 1) {
                for (let i = 1; i <= products.totalPages; i++) {
                    pages.push({page: i, limit: limit, filtro: filtro, sort: sort, pageNow: i == products.page ? true : false });
                }
            }
    
            res.render("products", {
                title: "Productos",
                fileCss: "style.css",
                products,
                elementos,
                pages,
                sort,
                filtro,
                user
            });
    
        } catch (error) {
            res.status(500).json({error: "Error del servicor al Renderizar ProductosPaginate"});
        }
    }

    async viewProductById (req, res) {
        try {
            if (!req.user) {
                return res.redirect("/login");
            }
            const user = req.user;
    
            const {pid} = req.params;
            let product = await productServices.getProductById(pid);
            // console.log (product)
            if (product) {
                product = {
                    ...product._doc,
                    price: product.price.toFixed(2)
                }
            }
            
            res.render("product", {
                title: product ? product.title : "El producto no existe",
                fileCss: "style.css",
                product,
                user
            });
        } catch (error) {
            res.status(500).json({error: "Error del servicor al renderizar un Producto" + error});
            //console.log (error)
        }
    }

    async viewCart (req, res) {
        try {
            if (!req.user) {
                return res.redirect("/login");
            }
            const user = req.user;
    
            let cart = await cartServices.getCartById(user.cart);
            
            const cartTotal = cart.products.map(inCart => {
                const totalProd = {
                    ...inCart,
                    totalPrice: (inCart.quantity * inCart.product.price).toFixed(2),
                    }
                return totalProd
            })

            const sinStock = [];
            const enStock = [];
            for (let prod of cartTotal) {
                prod.quantity <= prod.product.stock ? enStock.push(prod) : sinStock.push(prod);
            }
            
            const totalFinal = cartTotal.reduce((acumulador, elemento) => acumulador + Number(elemento.totalPrice), 0).toFixed(2);
    
            res.render("cart", {
                title: "Carrito",
                fileCss: "style.css",
                cart,
                sinStock,
                enStock,
                totalFinal,
                user
            });

        } catch (error) {
            //console.log(error)
            res.status(500).json({error: "Error del servidor al renderizar Carrito", error});
        }
    }

    async viewFavorite (req, res) {
        try {
            
            if (!req.user) {
                return res.redirect("/login");
            }
            const user = req.user;

            

            res.render("favorite", {
                title: "Productos favoritos",
                fileCss: "style.css",

                user
            });
        } catch (error) {
            
        }
    }

    async viewUsers (req, res) {
        try {
            
            if (!req.user) {
                return res.redirect("/login");
            }
            const user = req.user;

            

            res.render("users", {
                title: "Administrador de Usuarios",
                fileCss: "style.css",

                user
            });
        } catch (error) {
            
        }
    }

    async viewRealTimeProducts (req, res) {
        try {
            let user = {...req.user,
                owner: "ADMIN"
            }

            if (user.role === "PREMIUM") {
                user = {...user, owner: user.email}
            }
    
            res.render("realTimeProducts", {
                title: "Manager de productos",
                fileCss: "style.css",
                user
            });
        } catch (error) {
            res.status(500).json({error: "Error del servidor al Renderizar RealTimeProducts" + error});
        }
    }

    async viewMessages (req, res) {
        try {

            if (!req.user) {
                return res.redirect("/login");
            }
            const user = req.user;
            const chats = await chatServices.getAllMessages();
            res.render("chat", {
                title: "CHAT",
                fileCss: "style.css",
                chats,
                user
            });
        } catch (e) {
            //console.log(e);
            res.status(500).json({error: "Error del servidor al Renderizar ChatRoom" + e});
        }
    }

    viewLogin (req, res) {
        try {
            res.render("login", {
                title: "Login",
                fileCss: "style.css"
            })
        } catch (error) {
            res.status(500).json({error: "Error del servidor al Renderizar Login" + error});
        }
    }

    viewRegister (req, res) {
        try {
            res.render("register", {
                title: "Registro",
                fileCss: "style.css"
            })
        } catch (error) {
            res.status(500).json({error: "Error del servidor al Renderizar Register" + error});
        }
    }

    async viewResetPassword (req, res) {
        try {
            res.render("resetPassword", {
                title: "Restablecimiento de Contraseña",
                fileCss: "style.css"
            })
        } catch (error) {
            res.status(500).json({error: "Error del servidor al Renderizar Restablecimeinto de Contraseña"});
        }
    }

    async viewChargePassword (req, res) {
        try {
            res.render("passwordChange", {
                title: "Restablecimiento de Contraseña",
                fileCss: "style.css"
            })
        } catch (error) {
            res.status(500).json({error: "Error del servidor al Renderizar Restablecimeinto de Contraseña"});
        }
    }

    async viewSendMailReset (req, res) {
        try {
            res.render("sendMailReset", {
                title: "Restablecimiento de Contraseña",
                fileCss: "style.css"
            })
        } catch (error) {
            res.status(500).json({error: "Error del servidor al Renderizar Restablecimeinto de Contraseña"});
        }
    }

    viewProfile (req, res) {
        try {
            const user = req.user
            // console.log(user)
            res.render("profile", {
                title: `Perfil de ${req.user.first_name}`,
                fileCss: "style.css",
                user
            })
        } catch (error) {
            res.status(500).json({error: "Error del servidor al Renderizar Profile" + error});
        }
    }

    viewRestricted (req, res) {
        try {
            const user = req.user
            res.render("noAccess", {
                title: `Acceso Denegado!`,
                fileCss: "style.css",
                user
            })
        } catch (error) {
            res.status(500).json({error: "Error del servidor al Renderizar Restricted" + error});
        }
    }

    async viewCheckOut (req, res) {

        const { tid } = req.params;
        try {
            if (!req.user) {
                return res.redirect("/login");
            }
            const user = req.user;

            const searchBuy = await ticketServices.getTicketById(tid);

            const totalProdBuy = searchBuy.products.map(inBuy => {
                const totalProd = {
                    ...inBuy,
                    totalPrice: (inBuy.quantity * inBuy.price).toFixed(2),
                    }
                return totalProd;
            })

            const buy = {
                ...searchBuy,
                products: totalProdBuy
            }

            let cart = await cartServices.getCartById(user.cart);

            res.render("checkout", {
                title: `Detalle de Compra`,
                fileCss: "style.css",
                user,
                buy,
                cart
            });

        } catch (error) {
            res.status(500).json({error: "Error del servidor al Renderizar Compra" + error});
        }
    }

    async viewBuys (req, res) {
        try {
            if (!req.user) {
                return res.redirect("/login");
            }
            const user = req.user
            const { tid } = req.params;
            const findUser = await userServices.getUserByEmail({email: user.email});

            if (findUser.purchases.length === 0) {
                const ticket = false;
                const buysUser = false;

                res.render("buys", {
                    title: `Mis compras`,
                    fileCss: "style.css",
                    user,
                    buysUser,
                    ticket
                })
                return;
            }

        
            const buysUser = findUser.purchases.map(buy => {
                const buys = {
                    purchasesId: buy.purchasesId,
                    code: buy.code
                }
                return buys;
            });

            let ticketSearch = tid == "tid" ? await ticketServices.getTicketById(findUser.purchases[0].purchasesId) : await ticketServices.getTicketById(tid);

            const ticketTotalprice = ticketSearch.products.map(prod => {
                const totalProd = {
                    ...prod,
                    totalPrice: (prod.quantity * prod.price).toFixed(2)
                }
                return totalProd;
            })

            const ticket = {
                ...ticketSearch,
                products: ticketTotalprice
            }

            res.render("buys", {
                title: `Mis compras`,
                fileCss: "style.css",
                user,
                buysUser,
                ticket
            })
        } catch (error) {
            res.status(500).json({error: "Error del servidor al Renderizar Panel de compras" + error});
        }

    }

    mockingproducts (req, res) {
            //Generamos un array de usuarios: 
        const productos = []; 
        for (let i = 0; i < 100; i++) {
            productos.push(generarProductos()); 
        }

        res.send(productos);
    }
}

export default ViewController;