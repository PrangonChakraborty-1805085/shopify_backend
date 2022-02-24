const {
  verifyTokenAndCustomer,
  verifyTokenAndAdmin,
  verifyTokenAndSeller,
  verifyToken,
} = require("./verifyToken");

const router = require("express-promise-router")();

const ProductController = require("../apiController/product").ProductController;
let productController = new ProductController();

router.get("/id/:id", productController.getProduct);
//all can see the offers..so no middleware
router.get("/offers", productController.getOffers);
router.post("/add", verifyTokenAndSeller, productController.addProduct);
router.get("/all", verifyTokenAndAdmin, productController.getAllProducts);
//all can see the categories..so no middleware
router.get("/categories", productController.getAllCategories);
router.get("/categories/:cat_name", productController.getOneCategoryItems);
router.post(
  "/react",
  verifyTokenAndCustomer,
  productController.getReactEnabled
);
router.post(
  "/:stock_id/react",
  verifyTokenAndCustomer,
  productController.sendLoveReact
);
router.get("/most_popular", productController.getMostPopularProducts);

module.exports = router;
