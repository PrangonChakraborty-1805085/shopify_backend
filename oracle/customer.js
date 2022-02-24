const Workspace = require("./baseConnection").Workspace;
class CustomerWorkspace extends Workspace {
  constructor() {
    super();
  }

  findAllCustomer = async function () {
    const query =
      "SELECT c.customer_id id,a.email email,(a.firstname || ' ' ||a.lastname) fullname,a.image_url image_url from accounts a JOIN customers c on(a.email=c.email) order by c.customer_id";
    const params = [];
    const result = await this.query(query, params, {});
    return result;
  };
  deleteCustomer = async function (id) {
    // Binding occurs serially as present in the array
    const query =
      "DELETE FROM ACCOUNTS WHERE email=(SELECT EMAIL FROM CUSTOMERS WHERE CUSTOMER_ID=:1)";
    const params = [id];
    const result = await this.query(query, params, { autoCommit: true });
    return result;
  };
  getCustomerById = async function (id) {
    const query = `select email,(firstname||' '||lastname)fullname,username,phone_number,to_char(join_date,'DD/MM/YYYY') join_date,image_url,wallet,type
       from accounts
      WHERE email=(SELECT email from customers where customer_id=:1)`;
    const params = [id];
    const result = await this.query(query, params, { autoCommit: true });
    return result;
  };
  checkout = async function (obj) {
    let times = obj.stock_id.length;
    // console.log(times);
    let query = `insert into orders values (order_id_seq.nextval, :1, sysdate, null)`;
    let params = [obj.customer_id];
    let result = await this.query(query, params, { autoCommit: true });
    if (!result.success) {
      return result;
    }
    for (let i = 0; i < times; i++) {
      query = 
      `Declare
      BEGIN 
      Checkout(:1, :2, :3);
      END;`;
      params = [obj.customer_id, obj.stock_id[i], obj.quantity[i]]; 
      // console.log(`in the ${i}th time`);
      // result = await this.query(query, params, {autoCommit: true});
      result = await this.query(query, params, { autoCommit: true });
      // console.log('result is ',result.success);
      if (!result.success) {
        return result;
      }
    }
    return result;
  };
  getOrders = async function (customer_id) {
    const query = 
    `select distinct R.order_id, to_char(order_date,'DD-MM-YYYY') o_date,order_date, stock_id, 
    (select (firstname || ' ' || lastname) from accounts where email = (select email from sellers where seller_id = T.seller_id))seller_name, 
    name, category, price, rating, description, offer, image_url, 
    (select count(*) from products S where T.STOCK_ID = S.STOCK_ID and T.order_id = S.order_id) quantity
    from ORDERS R join products T on (R.order_id = T.order_id)
    where R.CUSTOMER_ID = :1
    order by order_date desc`;
    const params = [customer_id];
    const result = await this.query(query, params, { autoCommit: true });
    return result;
  };
  
  //   findOneSeller = async function (email, username) {
  //     // Binding occurs serially as present in the array
  //     const query =
  //       "SELECT email,firstname,lastname,username,phone_number,join_date,image_url,wallet,type from Accounts where email= :1 OR username=:2";
  //     const params = [email, username];
  //     const result = await this.query(query, params, {});
  //     return result;
  //   };
  //   findPassword = async function (email) {
  //     // Binding occurs serially as present in the array
  //     const query = "SELECT PASSWORD from Accounts where email= :1";
  //     const params = [email];
  //     const result = await this.query(query, params, {});
  //     return result;
  //   };
  //   findUserId = async function (email, type) {
  //     let query_string = "SELECT customer_id from customers where email= :1";
  //     if (type === "seller") {
  //       query_string = "SELECT seller_id from sellers where email= :1";
  //     } else if (type === "admin") {
  //       query_string = "SELECT admin_id from admins where email= :1";
  //     }
  //     else if(type==='delivery_man'){
  //       query_string = "SELECT delivery_man_id from delivery_mans where email= :1";
  //     }
  //     const query = query_string;
  //     const params = [email];
  //     const result = await this.query(query, params, {});
  //     return result;
  //   };
  //   findUserEmail = async function (id, type) {
  //     let query_string = "SELECT email from customers where customer_id= :1";
  //     if (type === "seller") {
  //       query_string = "SELECT email from sellers where seller_id= :1";
  //     } else if (type === "admin") {
  //       query_string = "SELECT email from admins where admin_id= :1";
  //     }
  //     else if(type==='delivery_man'){
  //       query_string = "SELECT email from delivery_mans where delivery_man_id= :1";
  //     }
  //     const query = query_string;
  //     const params = [id];
  //     const result = await this.query(query, params, {});
  //     return result;
  //   };
}

exports.CustomerWorkspace = CustomerWorkspace;
