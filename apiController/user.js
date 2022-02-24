const bcrypt = require("bcrypt");
const UserWorkspace = require("../oracle/user").UserWorkspace;
const userWorkspace = new UserWorkspace();
const jwt = require("jsonwebtoken");

class UserController {
  constructor() {}
  getAllUsers = async (req, res, next) => {
    let users = await userWorkspace.findAll();
    if (!users.success)
      return res
        .status(500)
        .json({ code: "E0001", description: "Internal Error" });
    else return res.status(200).json(users.data);
  };
  getUserById = async (req, res, next) => {
    const userId = req.params.id;
    const type = req.body.type;
    const user_email = await userWorkspace.findUserEmail(userId, type);
    const user = await userWorkspace.findOne(user_email.data[0].EMAIL, "");
    if (!user.success)
      return res
        .status(500)
        .json({ code: "E0001", description: "Internal Error" });
    else return res.status(200).json(user.data);
  };
  getUserByEmail = async (req, res, next) => {
    let email = req.params.email;
    console.log("we are searching for email ", email);
    // let email = req.body.email;
    let user = await userWorkspace.findOne(email, "");
    if (!user.success)
      return res
        .status(404)
        .json({ code: "E0002", description: "Internal Server Error" });
    else if (user.data.length === 0) {
      console.log("user not found");
      return res.status(500).json({
        code: "E0002",
        description: "user with email:" + email + " not found.",
      });
    }    else{
      const res_obj={
        email:user.data[0].EMAIL,
        fullname:user.data[0].FULLNAME,
        username:user.data[0].USERNAME,
        phone_number:user.data[0].PHONE_NUMBER,
        join_date:user.data[0].JOIN_DATE,
        image_url:user.data[0].IMAGE_URL,
        wallet:user.data[0].WALLET,
        type:user.data[0].TYPE
      }
      console.log('user fetched');
      return res.status(200).json(res_obj);
   }
  };
  insertNewUser = async (req, res, next) => {
    let newUser = req.body;
    let email = newUser.email;
    let username = newUser.username;

    /// i will validate the user using hapi/joi
    //const validationResult= registerValidation(req.body);
    //it will return true if user credentials are valid

    //check if username or email already exists
    let emailORUserExists = await userWorkspace.findOne(email, username);
    if (emailORUserExists.data.length === 0) {
      //hash the password before inserting in database
      const bcryptKey = 10;
      const salt = await bcrypt.genSalt(bcryptKey);
      newUser.password = await bcrypt.hash(req.body.password, salt);

      //now insert the user
      let insert_result = await userWorkspace.insertUser(newUser);
      if (!insert_result.success)
        return res
          .status(500)
          .json({ code: "E0001", description: "Internal Error" });
      else {
        // console.log(insert_result.data);
        console.log("inserted new user");
        let id;
        const user_id = await userWorkspace.findUserId(
          newUser.email,
          newUser.type
        );
        if (newUser.type === "customer") id = user_id.data[0].CUSTOMER_ID;
        else if (newUser.type === "seller") id = user_id.data[0].SELLER_ID;
        else if (newUser.type === "admin") id = user_id.data[0].ADMIN_ID;
        else if (newUser.type === "delivery_man")
          id = user_id.data[0].DELIVERY_MAN_ID;
        /// now create the jwt with the result data
        //seperate the userinfo from password
        const { password, ...others } = newUser;
        const res_user = {
          id: id,
          // user: newUser,
          ...others,
        };
        const accessToken = jwt.sign(
          {
            id: res_user.id,
            type: res_user.type,
            email: res_user.email,
          },
          process.env.JWT_SECRET_KEY,
          { expiresIn: "3d" }
        );
        return res.status(200).json({ res_user, accessToken });
      }
    } else {
      console.log("user already exists");
      return res.status(400).send("Username or Email already exists");
    }
  };
  loginUser = async (req, res, next) => {
    ///here email and password verification will be done by hapi/joi
    // console.log(req.body);
    let user = await userWorkspace.findOne(req.body.email, "");
    if (!user.success)
      return res
        .status(404)
        .json({ code: "E0002", description: "Internal Server Error" });
    else if (user.data.length === 0)
      return res.status(500).send("User not found");
    else {
      // const bcryptKey = 10;
      // const salt = await bcrypt.genSalt(bcryptKey);
      // const word = await bcrypt.hash(req.body.password, salt);
      // console.log(word);

      const userPassword_result = await userWorkspace.findPassword(
        req.body.email
      );
      const userPassword = userPassword_result.data[0].PASSWORD;
      // console.log('user pass = ',userPassword);
      const passwordMatched = await bcrypt.compare(
        req.body.password,
        userPassword
      );
      if (!passwordMatched) {
        return res.status(400).send("Wrong password");
      } else {
        //now get the user id
        let id;
        const user_id = await userWorkspace.findUserId(
          req.body.email,
          req.body.type
        );
        if (req.body.type === "customer") id = user_id.data[0].CUSTOMER_ID;
        else if (req.body.type === "seller") id = user_id.data[0].SELLER_ID;
        else if (req.body.type === "admin") id = user_id.data[0].ADMIN_ID;
        else if (req.body.type === "delivery_man")
          id = user_id.data[0].DELIVERY_MAN_ID;
        const { password, ...others } = req.body;
        const res_user = {
          id: id,
          ...others,
        };
        const accessToken = jwt.sign(
          {
            id: res_user.id,
            type: res_user.type,
            email: res_user.email,
          },
          process.env.JWT_SECRET_KEY,
          { expiresIn: "3d" }
        );
        return res.status(200).json({ res_user, accessToken });
      }
    }
  };
  deleteUser = async (req, res, next) => {
    let user_email = req.params.email;
    let resultt = await userWorkspace.deleteUser(user_email);
    if (!resultt.success)
      return res
        .status(500)
        .json({ code: "E0001", description: "Internal Error" });
    else {
      console.log("user deleted");
      return res.status(200).json("user deleted successfully");
    }
  };
  updateUser = async (req, res, next) => {
    //if req contains password update..then 1st hash the password
    const email = req.params.email;
    if (req.body.password != null) {
      const bcryptKey = 10;
      const salt = await bcrypt.genSalt(bcryptKey);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }
    let result = await userWorkspace.updateUser(req.body, email);
    if (!result.success)
      return res
        .status(500)
        .json({ code: "E0001", description: "Internal Error" });
    else {
      console.log("user updated");
      return res.status(200).json("user updated successfully");
    }
  };
  getNewMembers = async (req, res, next) => {
    //if req contains password update..then 1st hash the password
    let result = await userWorkspace.getNewMembers();
    if (!result.success)
      return res
        .status(500)
        .json({ code: "E0001", description: "Internal Error" });
    else {
      console.log("new members fetched");
      let newMembers = [];
      result.data.map((member) => {
        newMembers.push({
          img_url: member.IMAGE_URL,
          fullname: member.FULLNAME,
          type: member.TYPE,
        });
      });
      return res.status(200).json(newMembers);
    }
  };

  getAllTransactions = async (req, res, next) => {
    let transactions = await userWorkspace.getAllTransactions();
    if (!transactions.success)
      return res
        .status(500)
        .json({ code: "E0001", description: "Internal Error" });
    else {
      let res_obj = [];
      transactions.data.map((transaction) => {
        res_obj.push({
          id: transaction.TRANSACTION_ID,
          seller_name: transaction.SELLER_NAMELNAME,
          seller_image_url: transaction.SELLER_IMAGE_URL,
          customer_name: transaction.CUSTOMER_NAME,
          customer_image_url: transaction.CUSTOMER_IMAGE_URL,
          amount: transaction.AMOUNT,
          transaction_date: transaction.TRANSACTION_DATE,
        });
      });
      return res.status(200).json(res_obj);
    }
  }
  getLatestTransactions = async (req, res, next) => {
    let transactions = await userWorkspace.getLatestTransactions();
    if (!transactions.success)
      return res
        .status(500)
        .json({ code: "E0001", description: "Internal Error" });
    else {
      let res_obj = [];
      transactions.data.map((transaction) => {
        res_obj.push({
          customer_name: transaction.CUSTOMER_NAME,
          customer_image_url: transaction.CUSTOMER_IMAGE_URL,
          amount: transaction.AMOUNT,
          transaction_date: transaction.TRANSACTION_DATE,
        });
      });
      return res.status(200).json(res_obj);
    }
  }

  getAllOrders = async (req, res, next) => {
    let orders = await userWorkspace.getAllOrders();
    if (!orders.success)
      return res
        .status(500)
        .json({ code: "E0001", description: "Internal Error" });
    else {
      let res_obj = [];
      orders.data.map((order) => {
        res_obj.push({
          id: order.ORDER_ID,
          order_date: order.ORDER_DATE,
        });
      });
      console.log(res_obj);
      return res.status(200).json(res_obj); 
    }
  }

  updateDelivery = async (req, res, next) => {
    let orders = await userWorkspace.getAllOrders();
    if (!orders.success)
      return res
        .status(500)
        .json({ code: "E0001", description: "Internal Error" });
    else {
      let res_obj = [];
      orders.data.map((order) => {
        res_obj.push({
          id: order.ORDER_ID,
          order_date: order.ORDER_DATE,
        });
      })
      return res.status(200).json(res_obj); 
    }
  }
}

exports.UserController = UserController;
