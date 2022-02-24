const express = require("express");
const cors = require("cors");
const oracledb = require("oracledb");
const dotenv = require("dotenv");
// const bodyParser = require('body-parser');

// routes
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const sellerRoute = require("./routes/seller");
const customerRoute = require("./routes/customer");
const productRoute = require("./routes/product");
// const employeeRoute=require('./routes/employee');

//running app
const app = express();
app.use(cors({ origin: true }));
app.use(express.json());
dotenv.config();

//middlewares
// app.use(bodyParser);
app.use("/api/user", userRoute);
app.use("/api/user/auth", authRoute);
app.use("/api/seller", sellerRoute);
app.use("/api/customer", customerRoute);
app.use("/api/user/auth", authRoute);
app.use("/api/product", productRoute);

app.listen(process.env.PORT, () => {
  console.log(`backend server is running at port ${process.env.PORT}`);
});
