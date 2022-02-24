const bcrypt = require("bcrypt");
const CustomerWorkspace = require("../oracle/customer").CustomerWorkspace;
const ProductWorkspace = require("../oracle/product").ProductWorkspace;
const customerWorkspace = new CustomerWorkspace();
const productWorkspace = new ProductWorkspace();
// const jwt = require("jsonwebtoken");

class CustomerController {
  constructor() {}
  getAllCustomer = async (req, res, next) => {
    let customers_res = await customerWorkspace.findAllCustomer();
    if (!customers_res.success)
      return res
        .status(500)
        .json({ code: "E0001", description: "Internal Error" });
    else {
      //here convert the data to another array of objects
      let customers = [];
      customers_res.data.map((customer) => {
        customers.push({
          id: customer.ID,
          email: customer.EMAIL,
          fullname: customer.FULLNAME,
          image_url: customer.IMAGE_URL,
          // transaction_volume:'' //for future transaction
        });
      });
      console.log("customers fetched");
      return res.status(200).json(customers);
    }
  };
  deleteCustomer = async (req, res, next) => {
    let customer_id = req.params.id;
    let resultt = await customerWorkspace.deleteCustomer(customer_id);
    if (!resultt.success)
      return res
        .status(500)
        .json({ code: "E0001", description: "Internal Error" });
    else {
      console.log("customer deleted");
      return res.status(200).json("customer deleted successfully");
    }
  };
  getCustomerById = async (req, res, next) => {
    const customer_id = req.params.id;
    const customer = await customerWorkspace.getCustomerById(customer_id);
    if (!customer.success)
      return res
        .status(500)
        .json({ code: "E0001", description: "Internal Error" });
    else {
      const res_obj = {
        email: customer.data[0].EMAIL,
        fullname: customer.data[0].FULLNAME,
        username: customer.data[0].USERNAME,
        phone_number: customer.data[0].PHONE_NUMBER,
        join_date: customer.data[0].JOIN_DATE,
        image_url: customer.data[0].IMAGE_URL,
        wallet: customer.data[0].WALLET,
        type: customer.data[0].TYPE,
      };
      console.log("customer fetched");
      return res.status(200).json(res_obj);
    }
  };
  checkout = async (req, res, next) => {
    //calculate the present wallet balance of customer_id 
    let temp = await customerWorkspace.getCustomerById(req.body.customer_id);
    let wallet_balance = temp.data[0].WALLET; 

    //calculate the total product price of the cart
    let s = 0;
    for(let i = 0; i < req.body.stock_id.length; i++) {
      temp = await productWorkspace.findOne(req.body.stock_id[i]);

      if (temp.data[0].OFFER != null) {
        s = s + (temp.data[0].PRICE - temp.data[0].PRICE*temp.data[0].OFFER/100) * req.body.quantity[i];
      } else {
        s = s + temp.data[0].PRICE * req.body.quantity[i];
      }
      
    }
    let total_product_price = s;
    // console.log('aa %d bb %d cc %d', s, wallet_balance, total_product_price);

    //if wallet balance >= total price..he can buy
    if(wallet_balance >= total_product_price) 
    {
      
      //now customer has enough money to buy
      let result = await customerWorkspace.checkout(req.body);
      if (!result.success)
      return res
      .status(500)
      .json({ code: "E0001", description: "Internal Error" });
      else {
        console.log('checkout successful');
        return res.status(200).json("Checked Out Successfully");
      }
    }
    else
    {
      res.status(400).json('Checkout Unsuccessful');
    }
  };

  getOrders = async (req, res, next) => {
    const customer_id = req.params.customer_id;
    const orders = await customerWorkspace.getOrders(customer_id);
    if (!orders.success)
      return res
        .status(500)
        .json({ code: "E0001", description: "Internal Error" });
    else {
      let res_obj = [];
      orders.data.map((order) => {
        res_obj.push({
          order_id: order.ORDER_ID,
          order_date: order.O_DATE,
          stock_id: order.STOCK_ID,
          seller_name: order.SELLER_NAME,
          name: order.NAME,
          category: order.CATEGORY,
          price: order.PRICE,
          rating: order.RATING,
          description: order.DESCRIPTION,
          offer: order.OFFER,
          image_url: order.IMAGE_URL,
          quantity: order.QUANTITY,
        });
      });
      return res.status(200).json(res_obj);
    }
  };

  //   getUserById = async (req, res, next) => {
  //     const userId = req.params.id;
  //     const type = req.body.type;
  //     const user_email = await userWorkspace.findUserEmail(userId, type);
  //     const user = await userWorkspace.findOne(user_email.data[0].EMAIL, "");
  //     if (!user.success)
  //       return res
  //         .status(500)
  //         .json({ code: "E0001", description: "Internal Error" });
  //     else return res.status(200).json(user.data);
  //   };
  //   getUserByEmail = async (req, res, next) => {
  //     let email = req.params.email;
  //     console.log(email);
  //     // let email = req.body.email;
  //     let user = await userWorkspace.findOne(email, "");
  //     if (!user.success)
  //       return res
  //         .status(404)
  //         .json({ code: "E0002", description: "Internal Server Error" });
  //     else if (user.data.length === 0)
  //       return res.status(500).json({
  //         code: "E0002",
  //         description: "user with email:" + email + " not found.",
  //       });
  //     else {
  //       return res.status(200).json(user.data[0]);
  //     }
  //   };
  //   insertNewUser = async (req, res, next) => {
  //     let newUser = req.body;
  //     let email = newUser.email;
  //     let username = newUser.username;

  //     /// i will validate the user using hapi/joi
  //     //const validationResult= registerValidation(req.body);
  //     //it will return true if user credentials are valid

  //     //check if username or email already exists
  //     let emailORUserExists = await userWorkspace.findOne(email, username);
  //     if (emailORUserExists.data.length === 0) {
  //       //hash the password before inserting in database
  //       const bcryptKey = 10;
  //       const salt = await bcrypt.genSalt(bcryptKey);
  //       newUser.password = await bcrypt.hash(req.body.password, salt);

  //       //now insert the user
  //       let insert_result = await userWorkspace.insertUser(newUser);
  //       if (!insert_result.success)
  //         return res
  //           .status(500)
  //           .json({ code: "E0001", description: "Internal Error" });
  //       else {
  //         // console.log(insert_result.data);
  //         console.log("inserted new user");
  //         let id;
  //         const user_id = await userWorkspace.findUserId(
  //           newUser.email,
  //           newUser.type
  //         );
  //         if (newUser.type === "customer") id = user_id.data[0].CUSTOMER_ID;
  //         else if (newUser.type === "seller") id = user_id.data[0].SELLER_ID;
  //         else if (newUser.type === "admin") id = user_id.data[0].ADMIN_ID;
  //         else if (newUser.type === "delivery_man")
  //           id = user_id.data[0].DELIVERY_MAN_ID;
  //         /// now create the jwt with the result data
  //         //seperate the userinfo from password
  //         const { password, ...others } = newUser;
  //         const res_user = {
  //           id: id,
  //           // user: newUser,
  //           ...others,
  //         };
  //         const accessToken = jwt.sign(
  //           {
  //             id: res_user.id,
  //             type: res_user.type,
  //             email: res_user.email,
  //           },
  //           process.env.JWT_SECRET_KEY,
  //           { expiresIn: "3d" }
  //         );
  //         return res.status(200).json({ res_user, accessToken });
  //       }
  //     } else {
  //       console.log("user already exists");
  //       return res.status(400).send("Username or Email already exists");
  //     }
  //   };
  //   loginUser = async (req, res, next) => {
  //     ///here email and password verification will be done by hapi/joi
  //     // console.log(req.body);
  //     let user = await userWorkspace.findOne(req.body.email, "");
  //     if (!user.success)
  //       return res
  //         .status(404)
  //         .json({ code: "E0002", description: "Internal Server Error" });
  //     else if (user.data.length === 0)
  //       return res.status(500).send("User not found");
  //     else {
  //       // const bcryptKey = 10;
  //       // const salt = await bcrypt.genSalt(bcryptKey);
  //       // const word = await bcrypt.hash(req.body.password, salt);
  //       // console.log(word);

  //       const userPassword_result = await userWorkspace.findPassword(
  //         req.body.email
  //       );
  //       const userPassword = userPassword_result.data[0].PASSWORD;
  //       // console.log('user pass = ',userPassword);
  //       const passwordMatched = await bcrypt.compare(
  //         req.body.password,
  //         userPassword
  //       );
  //       if (!passwordMatched) {
  //         return res.status(400).send("Wrong password");
  //       } else {
  //         //now get the user id
  //         let id;
  //         const user_id = await userWorkspace.findUserId(
  //           req.body.email,
  //           req.body.type
  //         );
  //         if (req.body.type === "customer") id = user_id.data[0].CUSTOMER_ID;
  //         else if (req.body.type === "seller") id = user_id.data[0].SELLER_ID;
  //         else if (req.body.type === "admin") id = user_id.data[0].ADMIN_ID;
  //         else if (req.body.type === "delivery_man")
  //           id = user_id.data[0].DELIVERY_MAN_ID;
  //         /// now create the jwt with the result data
  //         // const user_info={
  //         //   email:user.data[0].EMAIL,
  //         //   firstname:user.data[0].FIRSTNAME,
  //         //   lastname:user.data[0].LASTNAME,
  //         //   username:user.data[0].USERNAME,
  //         //   phone_number:user.data[0].PHONE_NUMBER,
  //         //   join_date:user.data[0].JOIN_DATE,
  //         //   image_url:user.data[0].IMAGE_URL,
  //         //   wallet:user.data[0].WALLET,
  //         //   type:user.data[0].TYPE,
  //         // }
  //         const { password, ...others } = req.body;
  //         const res_user = {
  //           id: id,
  //           ...others,
  //         };
  //         const accessToken = jwt.sign(
  //           {
  //             id: res_user.id,
  //             type: res_user.type,
  //             email: res_user.email,
  //           },
  //           process.env.JWT_SECRET_KEY,
  //           { expiresIn: "3d" }
  //         );
  //         return res.status(200).json({ res_user, accessToken });
  //       }
  //     }
  //   };
  //   deleteUser = async (req, res, next) => {
  //     let userObject = req.query;
  //     let resultt = await userWorkspace.deleteUser(userObject);
  //     if (!resultt.success)
  //       return res
  //         .status(500)
  //         .json({ code: "E0001", description: "Internal Error" });
  //     else {
  //       console.log("user deleted");
  //       return res.status(200).json("user deleted successfully");
  //     }
  //   };
  //   updateUser = async (req, res, next) => {
  //     //if req contains password update..then 1st hash the password
  //     const email = req.params.email;
  //     if (req.body.password) {
  //       const bcryptKey = 10;
  //       const salt = await bcrypt.genSalt(bcryptKey);
  //       req.body.password = await bcrypt.hash(req.body.password, salt);
  //     }
  //     let result = await userWorkspace.updateUser(req.body, email);
  //     if (!result.success)
  //       return res
  //         .status(500)
  //         .json({ code: "E0001", description: "Internal Error" });
  //     else {
  //       console.log("user updated");
  //       return res.status(200).json("user updated successfully");
  //     }
  //   };
  //   getNewMembers = async (req, res, next) => {
  //     //if req contains password update..then 1st hash the password
  //     let result = await userWorkspace.getNewMembers();
  //     if (!result.success)
  //       return res
  //         .status(500)
  //         .json({ code: "E0001", description: "Internal Error" });
  //     else {
  //       console.log("new members fetched");
  //       let newMembers = [];
  //       result.data.map((member) => {
  //         newMembers.push({
  //           img_url: member.IMAGE_URL,
  //           fullname: member.FULLNAME,
  //           type: member.TYPE,
  //         });
  //       });
  //       return res.status(200).json(newMembers);
  //     }
  //   };

}
exports.CustomerController = CustomerController;
