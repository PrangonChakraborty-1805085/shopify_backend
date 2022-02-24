const Workspace = require("./baseConnection").Workspace;
class ProductWorkspace extends Workspace {
  constructor() {
    super();
  }

  findOne = async function (id) {
    const query = `select stock_id,seller_id,name,category,price,rating,description,offer,image_url, count(stock_id) stock from products group by stock_id,seller_id,name,category,price,rating,description,offer,image_url 
    having stock_id = :1`;
    const params = [id];
    const result = await this.query(query, params, {});
    return result;
  };
  getStock = async function (id) {
    const query = "SELECT COUNT(*) STOCK FROM PRODUCTS WHERE STOCK_ID=:1";
    const params = [id];
    const result = await this.query(query, params, {});
    return result;
  };

  getStockQuantity = async function (id) {
    const query =
      "SELECT count(*) stock FROM PRODUCTS WHERE STOCK_ID=:1 and order_id is null";
    const params = [id];
    const result = await this.query(query, params, {});
    return result;
  };

  findAllProducts = async function () {
    const query = `select p.stock_id,count(*) stock, p.name,p.image_url,p.price, 
    (select (firstname||' '||lastname) fullname from accounts where email=(select email from sellers where seller_id = p.seller_id )) seller_name 
    from products p 
    where p.order_id is null
    GROUP BY p.stock_id,p.seller_id, p.name,p.image_url,p.price `;
    const params = [];
    const result = await this.query(query, params, {});
    return result;
  };

  findOffers = async function () {
    const query = `select stock_id, name, image_url, offer 
                  from products where order_id is null
                   group by stock_id,name,image_url,offer
                   having offer is not null
                   order by offer desc,name asc`;
    const params = [];
    const result = await this.query(query, params, {});
    return result;
  };

  findMostRating = async function () {
    const query = "SELECT Id FROM PRODUCT order by rating";
    const params = [];
    const result = await this.query(query, params, {});
    return result;
  };

  getAllCategories = async function () {
    const query = `select distinct category, IMAGE_URL
    from products
    where order_id is null`;
    const params = [];
    const result = await this.query(query, params, {});
    return result;
  };

  addProduct = async function (obj) {
    const query = `BEGIN
    addproduct(:1, :2, :3, :4, :5, :6, :7, :8) ;
    END ;
    `;
    const params = [
      obj.email,
      obj.name,
      obj.category,
      obj.price,
      obj.stock,
      obj.description,
      obj.offer,
      obj.image_url,
    ];
    const result = await this.query(query, params, { autoCommit: true });
    return result;
  };

  getOneCategoryItems = async function (category) {
    const query = `select distinct stock_id, name, image_url, price from products where category = :1 and order_id is null`;
    const params = [category];
    const result = await this.query(query, params, { autoCommit: true });
    return result;
  };
  getReactEnabled = async function (obj) {
    const customer_id = obj.customer_id;
    const stock_id = obj.stock_id;
    const query = 
    `select count(*) count
    from orders T join products P using(order_id) --join product_react R on T.CUSTOMER_ID = R.CUSTOMER_ID
    where (T.customer_id = :1 and P.STOCK_ID = :2) and not EXISTS
    (
    select * from product_react R where R.customer_id = :3 and R.STOCK_ID = :4
    )`;
    const params = [customer_id, stock_id,customer_id,stock_id];
    const result = await this.query(query, params, { autoCommit: true });
    return result;
  };

  sendLoveReact = async function (customer_id, stock_id) {
    console.log('customer_id in send love',customer_id);
    console.log('stock in send love',stock_id);
    const query = "insert into product_react VALUES(:1, :2)";
    const params = [stock_id,customer_id];
    const result = await this.query(query, params, { autoCommit: true });
    return result;
  };

  getMostPopularProducts = async function () {
    const query = 
    `select P.stock_id, P.IMAGE_URL, (select count(*) from product_react where stock_id = P.stock_id) counter
    from product_react R join products P on P.stock_id = R.STOCK_ID
    group by P.stock_id, P.image_url
    order by counter desc`;
    const params = [];
    const result = await this.query(query, params, { autoCommit: true });
    return result;
  }
}

exports.ProductWorkspace = ProductWorkspace;
