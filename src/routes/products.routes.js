import { Router } from "express";
import ProductController from "../controllers/products.controler.js";

const router = Router();
const productController = new ProductController();

router.get("/", productController.getProductsPaginate);
router.get("/:pid", productController.getProductById)
router.post("/", productController.createProduct);
router.post("/:pid/notify/:uid", productController.notifyProducto);
router.post("/:pid/favorite/:uid", productController.favoriteProduct);
router.put("/:pid", productController.updateProduct);
router.delete("/:pid", productController.deleteProduct);

export default router;
