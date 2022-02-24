const Workspace = require("./baseConnection").Workspace;
class UserWorkspace extends Workspace {
  constructor() {
    super();
  }

  findAll = async function () {
    const query = "SELECT * FROM ACCOUNTS";
    const params = [];
    const result = await this.query(query, params, {});
    return result;
  };

  findOne = async function (email, username) {
    // Binding occurs serially as present in the array
    const query =
      "SELECT email,(firstname|| ' '||lastname)fullname,username,phone_number,to_char(join_date,'DD/MM/YYYY') join_date,image_url,wallet,type from Accounts where email= :1 OR username=:2";
    const params = [email, username];
    const result = await this.query(query, params, {});
    return result;
  };
  findPassword = async function (email) {
    // Binding occurs serially as present in the array
    const query = "SELECT PASSWORD from Accounts where email= :1";
    const params = [email];
    const result = await this.query(query, params, {});
    return result;
  };
  findUserId = async function (email, type) {
    let query_string = "SELECT customer_id from customers where email= :1";
    if (type === "seller") {
      query_string = "SELECT seller_id from sellers where email= :1";
    } else if (type === "admin") {
      query_string = "SELECT admin_id from admins where email= :1";
    } else if (type === "delivery_man") {
      query_string =
        "SELECT delivery_man_id from delivery_mans where email= :1";
    }
    const query = query_string;
    const params = [email];
    const result = await this.query(query, params, {});
    return result;
  };
  findUserEmail = async function (id, type) {
    let query_string = "SELECT email from customers where customer_id= :1";
    if (type === "seller") {
      query_string = "SELECT email from sellers where seller_id= :1";
    } else if (type === "admin") {
      query_string = "SELECT email from admins where admin_id= :1";
    } else if (type === "delivery_man") {
      query_string =
        "SELECT email from delivery_mans where delivery_man_id= :1";
    }
    const query = query_string;
    const params = [id];
    const result = await this.query(query, params, {});
    return result;
  };
  insertUser = async function (userObject) {
    // Binding occurs serially as present in the array
    // console.log(userObject);
    const query =
      "INSERT INTO Accounts(email,firstname,lastname,username,password,wallet,type) VALUES (:1,:2,:3,:4,:5,0,:6)";
    const params = [
      userObject.email,
      userObject.firstname,
      userObject.lastname,
      userObject.username,
      userObject.password,
      userObject.type,
    ];
    const insert_result = await this.query(query, params, { autoCommit: true });
    return insert_result;
  };
  deleteUser = async function (email) {
    // Binding occurs serially as present in the array
    const query = "DELETE FROM ACCOUNTS WHERE email=:1";
    const params = [email];
    const result = await this.query(query, params, { autoCommit: true });
    return result;
  };
  updateUser = async function (userObject, email) {
    // Binding occurs serially as present in the array
    let result;
    if (userObject.firstname != null)
      result = await this.query(
        `UPDATE ACCOUNTS SET FIRSTNAME = :1 WHERE EMAIL=:2`,
        [userObject.firstname, email],
        { autoCommit: true }
      );
    if (userObject.lastname != null)
      result = await this.query(
        `UPDATE ACCOUNTS SET LASTNAME = :1 WHERE EMAIL=:2`,
        [userObject.lastname, email],
        { autoCommit: true }
      );
    if (userObject.password != null)
      result = await this.query(
        `UPDATE ACCOUNTS SET PASSWORD = :1 WHERE EMAIL=:2`,
        [userObject.password, email],
        { autoCommit: true }
      );
    if (userObject.image_url != null)
      result = await this.query(
        `UPDATE ACCOUNTS SET IMAGE_URL = :1 WHERE EMAIL=:2`,
        [userObject.image_url, email],
        { autoCommit: true }
      );
    if (userObject.phone_number != null)
      result = await this.query(
        `UPDATE ACCOUNTS SET PHONE_NUMBER = :1 WHERE EMAIL=:2`,
        [userObject.phone_number, email],
        { autoCommit: true }
      );
    if (userObject.wallet != null)
      result = await this.query(
        `UPDATE ACCOUNTS SET WALLET = :1 WHERE EMAIL=:2`,
        [userObject.wallet, email],
        { autoCommit: true }
      );
    return result;
  };
  getNewMembers = async function () {
    // Binding occurs serially as present in the array
    const query =
      "SELECT (FIRSTNAME ||' '||LASTNAME) fullname,image_url,type FROM accounts ORDER BY join_date desc fetch first 5 rows only";
    const params = [];
    const result = await this.query(query, params, { autoCommit: true });
    return result;
  };

  getAllTransactions = async function () {
    const query = 
    `select transaction_id,
    (select (firstname || ' ' || lastname)  from accounts where email = (select email from sellers where seller_id = T.SELLER_ID)) seller_name,
    (select IMAGE_URL from accounts where email = (select email from sellers where seller_id = T.SELLER_ID)) seller_image_url,
    (select (firstname || ' ' || lastname) from accounts where email = (select email from customers where customer_id = T.customer_ID)) customer_name,
    (select IMAGE_URL from accounts where email = (select email from customers where customer_id = T.customer_ID)) customer_image_url,
    AMOUNT, TRANSACTION_DATE
    from TRANSACTIONS T
    order by TRANSACTION_DATE desc`
    const params = [];
    const result = await this.query(query, params, { autoCommit: true });
    return result;
  }

  getLatestTransactions = async function () {
    const query = 
    `select (select (firstname || ' ' || lastname) from accounts where email = (select email from customers where customer_id = T.customer_ID)) customer_name,
    (select IMAGE_URL from accounts where email = (select email from customers where customer_id = T.customer_ID)) customer_image_url, transaction_date, amount
    from TRANSACTIONS T
    ORDER BY TRANSACTION_DATE desc
    fetch first 4 rows only`;
    const params = [];
    const result = await this.query(query, params, { autoCommit: true });
    return result;
  }

  getAllOrders = async function () {
    const query = 
    `select order_id, order_date
    from ORDERS
    where order_id <> all (select order_id from home_delivery)
    order by order_date asc`;
    const params = [];
    const result = await this.query(query, params, { autoCommit: true });
    return result;
  }

  updateDelivery = async function () {
    const query = 
    `select order_id, order_date
    from ORDERS
    where order_id <> all (select order_id from home_delivery)
    order by order_date asc`;
    const params = [];
    const result = await this.query(query, params, { autoCommit: true });
    return result;
  }
}

exports.UserWorkspace = UserWorkspace;
