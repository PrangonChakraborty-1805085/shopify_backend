const Workspace = require("./baseConnection").Workspace;
class SellerWorkspace extends Workspace {
  constructor() {
    super();
  }

  findAllSeller = async function () {
    const query =
      "SELECT s.seller_id id , a.email email,(a.firstname || ' ' ||a.lastname) fullname,a.image_url image_url from accounts a JOIN sellers s on(a.email=s.email) order by s.seller_id";
    const params = [];
    const result = await this.query(query, params, {});
    return result;
  };
  deleteSeller = async function (id) {
    // Binding occurs serially as present in the array
    const query =
      "DELETE FROM ACCOUNTS WHERE email=(SELECT EMAIL FROM SELLERS WHERE SELLER_ID=:1)";
    const params = [id];
    const result = await this.query(query, params, { autoCommit: true });
    return result;
  };
  getSellerById = async function (id) {
    const query =
      "select email,(firstname||' '||lastname)fullname,username,phone_number,to_char(join_date,'DD/MM/YYYY') join_date,image_url,wallet,type from accounts WHERE email=(SELECT email from sellers where seller_id=:1)";
    const params = [id];
    const result = await this.query(query, params, {});
    return result;
  };
  getSellerByEmail = async function (email) {
    const query =
      "select email,(firstname||' '||lastname)fullname,username,phone_number,to_char(join_date,'DD/MM/YYYY') join_date,image_url,wallet,type from accounts WHERE email=:1";
    const params = [email];
    const result = await this.query(query, params, {});
    return result;
  };
  getSellerProducts = async function (seller_id) {
    const query = `select p.stock_id,count(*) stock, p.name,p.image_url,p.price,p.description,p.offer, 
    (select (firstname||' '||lastname) fullname from accounts where email=(select email from sellers where seller_id = p.seller_id )) seller_name 
    from products p 
    where p.order_id is null and seller_id = :1
    GROUP BY p.stock_id,p.seller_id, p.name,p.image_url,p.price,p.description,p.offer`;
    const params = [seller_id];
    const result = await this.query(query, params, {});
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

exports.SellerWorkspace = SellerWorkspace;
