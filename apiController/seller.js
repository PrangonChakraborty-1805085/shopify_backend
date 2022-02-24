const bcrypt = require("bcrypt");
const SellerWorkspace = require("../oracle/seller").SellerWorkspace;
const sellerWorkspace = new SellerWorkspace();
const jwt = require("jsonwebtoken");

class SellerController {
  constructor() {}
  getAllSeller = async (req, res, next) => {
    let sellers_res = await sellerWorkspace.findAllSeller();
    if (!sellers_res.success)
      return res
        .status(500)
        .json({ code: "E0001", description: "Internal Error" });
    else {
      //here convert the data to another array of objects
      let sellers = [];
      sellers_res.data.map((seller) => {
        sellers.push({
          id: seller.ID,
          email: seller.EMAIL,
          fullname: seller.FULLNAME,
          image_url: seller.IMAGE_URL,
          // transaction_volume:'' //for future transaction
        });
      });
      console.log("sellers fetched");
      return res.status(200).json(sellers);
    }
  };
  deleteSeller = async (req, res, next) => {
    let seller_id = req.params.id;
    let resultt = await sellerWorkspace.deleteSeller(seller_id);
    if (!resultt.success)
      return res
        .status(500)
        .json({ code: "E0001", description: "Internal Error" });
    else {
      console.log("seller deleted");
      return res.status(200).json("seller deleted successfully");
    }
  };
  getSellerById = async (req, res, next) => {
    const seller_id = req.params.id;
    const seller = await sellerWorkspace.getSellerById(seller_id);
    if (!seller.success)
      return res
        .status(500)
        .json({ code: "E0001", description: "Internal Error" });
    else {
      const res_obj = {
        email: seller.data[0].EMAIL,
        fullname: seller.data[0].FULLNAME,
        username: seller.data[0].USERNAME,
        phone_number: seller.data[0].PHONE_NUMBER,
        join_date: seller.data[0].JOIN_DATE,
        image_url: seller.data[0].IMAGE_URL,
        wallet: seller.data[0].WALLET,
        type: seller.data[0].TYPE,
      };
      console.log("seller fetched");
      return res.status(200).json(res_obj);
    }
  };
  getSellerByEmail = async (req, res, next) => {
    const seller_email = req.params.email;
    const seller = await sellerWorkspace.getSellerByEmail(seller_email);
    if (!seller.success)
      return res
        .status(500)
        .json({ code: "E0001", description: "Internal Error" });
    else {
      const res_obj = {
        email: seller.data[0].EMAIL,
        fullname: seller.data[0].FULLNAME,
        username: seller.data[0].USERNAME,
        phone_number: seller.data[0].PHONE_NUMBER,
        join_date: seller.data[0].JOIN_DATE,
        image_url: seller.data[0].IMAGE_URL,
        wallet: seller.data[0].WALLET,
        type: seller.data[0].TYPE,
      };
      console.log("seller fetched");
      return res.status(200).json(res_obj);
    }
  };
  getSellerProducts = async (req, res, next) => {
    const seller_id = req.params.id;
    const products_res = await sellerWorkspace.getSellerProducts(seller_id);
    if (!products_res.success)
      return res
        .status(500)
        .json({ code: "E0001", description: "Internal Error" });
    else {
      let products = [];
      products_res.data.map((product) => {
        products.push({
          id: product.STOCK_ID,
          stock: product.STOCK,
          category: product.CATEGORY, 
          name: product.NAME,
          price: product.PRICE,
          image_url: product.IMAGE_URL,
          description: product.DESCRIPTION,
          offer: product.OFFER,
          rating: product.RATING,

        });
      });
      console.log(`products of seller ${req.params.id} fetched`);
      return res.status(200).json(products);
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

exports.SellerController = SellerController;
