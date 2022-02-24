// const router = require('express-promise-router')();
const router = require("express").Router();

const EmployeeController = require('../apiController/employee').EmployeeController;
let employeeController = new EmployeeController();

router.get('/all',employeeController.list);
router.get('/:id',employeeController.fetch);

router.delete('/',);
router.put('/',);

module.exports = router;
