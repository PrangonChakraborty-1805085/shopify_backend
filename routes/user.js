const {verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('./verifyToken');

const router = require('express-promise-router')();
// const router = require("express").Router();


const UserController = require('../apiController/user').UserController;
let userController = new UserController();

//all these requests can be done by admin, so i will add verifyTokenAndAdmin middleware
router.get('/all',verifyTokenAndAdmin,userController.getAllUsers);
router.get('/id/:id',verifyTokenAndAuthorization,userController.getUserById);
router.get('/email/:email',verifyTokenAndAuthorization,userController.getUserByEmail);
router.get('/newMembers',verifyTokenAndAdmin,userController.getNewMembers);
router.get('/transaction/latest',verifyTokenAndAdmin,userController.getLatestTransactions);
router.get('/transaction/all',verifyTokenAndAdmin,userController.getAllTransactions);
router.get('/allOrders', userController.getAllOrders)
router.post('/order/:id',userController.updateDelivery);
 
// router.get('/transaction/latest',userController.getLatestTransactions);
// router.get('/transaction/all',userController.getAllTransactions);

//update user credentials..only done by a specific user 
router.put('/:email',verifyTokenAndAuthorization,userController.updateUser); 

//delete requests
// router.delete('/:id',userController.deleteUser);


  
module.exports = router; 