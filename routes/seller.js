const {verifyTokenAndAuthorization, verifyTokenAndAdmin, verifyTokenAndAdminOrSeller } = require('./verifyToken');

const router = require('express-promise-router')();

const SellerController = require('../apiController/seller').SellerController;
let sellerController = new SellerController();

//add verifyTokenAndAdminOrSeller middleware
router.get('/all',verifyTokenAndAdmin,sellerController.getAllSeller);

//seller or admin can see info of a seller
router.get('/id/:id',verifyTokenAndAdminOrSeller,sellerController.getSellerById);

router.get('/email/:email',verifyTokenAndAdminOrSeller,sellerController.getSellerByEmail);
// router.get('/newMembers',verifyTokenAndAdmin,userController.getNewMembers);
 

//getting products of a specific seller
router.get('/id/:id/products',verifyTokenAndAdminOrSeller,sellerController.getSellerProducts); 


//delete requests
router.delete('/:id',sellerController.deleteSeller);


  
module.exports = router; 