const {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

const router = require("express-promise-router")();

const CustomerController =
  require("../apiController/customer").CustomerController;
let customerController = new CustomerController();

//all these requests can be done by admin, so i will add verifyTokenAndAdmin middleware
router.get("/all", verifyTokenAndAdmin, customerController.getAllCustomer);
router.get("/id/:id", verifyTokenAndAdmin, customerController.getCustomerById);
// router.get('/email/:email',verifyTokenAndAuthorization,userController.getUserByEmail);
// router.get('/newMembers',verifyTokenAndAdmin,userController.getNewMembers);

//update user credentials..only done by a specific user
// router.put('/:email',verifyTokenAndAuthorization,userController.updateUser);

//delete requests
router.delete("/:id", customerController.deleteCustomer);
router.post("/:customerId/checkout", customerController.checkout);
router.get("/:customer_id/orders", customerController.getOrders);   

module.exports = router;
