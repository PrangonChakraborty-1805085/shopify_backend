const router = require('express-promise-router')();


const UserController = require('../apiController/user').UserController;
let userController = new UserController();

router.post('/register',userController.insertNewUser);
router.post('/login',userController.loginUser);
 
router.delete('/',);  
router.put('/',); 
  
module.exports = router; 