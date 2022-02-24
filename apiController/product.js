const ProductWorkspace = require("../oracle/product").ProductWorkspace;
const productWorkspace = new ProductWorkspace();

class ProductController {
  constructor() {}
  getProduct = async (req, res, next) => {
    let id = req.params.id;
    const product = await productWorkspace.findOne(id);
    const stock_quantity = await productWorkspace.getStockQuantity(id);

    if (!product.success)
      return res
        .status(404)
        .json({ code: "E0002", description: "Internal Server Error" });
    else if (product.data.length === 0)
      return res.status(500).json({
        code: "E0002",
        description: "product with id:" + id + " not found.",
      });
    else {
      const product_obj = {
        stock_id: product.data[0].STOCK_ID,
        seller_id: product.data[0].SELLER_ID,
        name: product.data[0].NAME,
        category: product.data[0].CATEGORY,
        price: product.data[0].PRICE,
        rating: product.data[0].RATING,
        description: product.data[0].DESCRIPTION,
        offer: product.data[0].OFFER,
        image_url: product.data[0].IMAGE_URL,
        stock: stock_quantity.data[0].STOCK,
      };
      return res.status(200).json(product_obj);
    }
  };
  getAllProducts = async (req, res, next) => {
    console.log("in getallproducts");
    const products_res = await productWorkspace.findAllProducts();
    if (!products_res.success)
      return res
        .status(500)
        .json({ code: "E0001", description: "Internal Error" });
    else {
      //here convert the data to another array of objects
      let products = [];
      products_res.data.map((product) => {
        products.push({
          id: product.STOCK_ID,
          stock: product.STOCK,
          name: product.NAME,
          seller_name: product.SELLER_NAME,
          price: product.PRICE,
          image_url: product.IMAGE_URL,
        });
      });
      console.log("products fetched");
      return res.status(200).json(products);
    }
  };

  getOffers = async (req, res, next) => {
    const result = await productWorkspace.findOffers();
    if (!result.success)
      return res
        .status(500)
        .json({ code: "E0001", description: "Internal Error" });
    else {
      let products = [];
      result.data.map((product) => {
        products.push({
          id: product.STOCK_ID,
          name: product.NAME,
          offer: product.OFFER,
          image_url: product.IMAGE_URL,
        });
      });
      return res.status(200).json(products);
    }
  };

  addProduct = async (req, res, next) => {
    const result = await productWorkspace.addProduct(req.body);
    if (!result.success)
      return res
        .status(500)
        .json({ code: "E0001", description: "Internal Error" });
    else {
      return res.status(200).json("Product added Successfully");
    }
  };

  getAllCategories = async (req, res, next) => {
    let products = await productWorkspace.getAllCategories();
    if (!products.success)
      return res
        .status(500)
        .json({ code: "E0001", description: "Internal Error" });
    else {
      let res_arr = [];
      products.data.map((product) => {
        res_arr.push({
          category: product.CATEGORY,
          image_url: product.IMAGE_URL,
        });
      });
      return res.status(200).json(res_arr);
    }
  };

  getOneCategoryItems = async (req, res, next) => {
    let cat_name = req.params.cat_name;
    let products = await productWorkspace.getOneCategoryItems(cat_name);
    if (!products.success)
      return res
        .status(500)
        .json({ code: "E0001", description: "Internal Error" });
    else {
      let res_arr = [];
      products.data.map((product) => {
        res_arr.push({
          stock_id: product.STOCK_ID,
          name: product.NAME,
          image_url: product.IMAGE_URL,
          price: product.PRICE,
        });
      });
      return res.status(200).json(res_arr);
    }
  };
  getReactEnabled = async (req, res, next) => {
    // let cat_name = req.params.cat_name;
    console.log("req body is ", req.body);
    let products = await productWorkspace.getReactEnabled(req.body);
    if (!products.success)
      return res
        .status(500)
        .json({ code: "E0001", description: "Internal Error" });
    else {
      console.log(products.data[0].COUNT);

      if (products.data[0].COUNT === 0) {
        console.log("not enbaled to love react");
        return res.status(400).json("Not eaabled");
      } else return res.status(200).json("enabled");
    }
  };

  sendLoveReact = async (req, res, next) => {
    let stock_id = req.params.stock_id;
    let customer_id = req.body.customer_id;
    let result = await productWorkspace.sendLoveReact(customer_id, stock_id);
    if (!result.success)
      return res
        .status(500)
        .json({ code: "E0001", description: "Internal Error" });
    else {
       return res.status(200).json("enabled");
    }
  };

  getMostPopularProducts = async (req, res, next) => {
    let products = await productWorkspace.getMostPopularProducts();
    if (!products.success)
      return res
        .status(500)
        .json({ code: "E0001", description: "Internal Error" });
    else {
      let res_arr = [];
      products.data.map((product) => {
        res_arr.push({
          stock_id: product.STOCK_ID,
          image_url: product.IMAGE_URL,
        });
      })
      console.log(res_arr);
      return res.status(200).json(res_arr);
      }
  };

  // getCartProducts = async (req, res, next) => {
  //   let products = await productWorkspace.getCartProducts(req.body);
  //   if (!products.success)
  //     return res
  //       .status(500)
  //       .json({ code: "E0001", description: "Internal Error" });
  //   else {
  //     let res_arr = [];
  //     products.data.map((product) => {
  //       res_arr.push({
  //         stock_id: product.STOCK_ID,
  //         name: product.NAME,
  //         image_url: product.IMAGE_URL,
  //         price: product.PRICE,
  //       });
  //     });
  //     return res.status(200).json(res_arr);
  //   }
  // };
}

exports.ProductController = ProductController;
