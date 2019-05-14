var express               = require('express');
var router                = express.Router();
var csrf                  = require('csurf') ;
var csrfProtection        = csrf({ cookie: true });
var Category              = require('./../models/category');
var categoryController    = require('../controllers/categoryController')(Category);

var loggedIn              = require('../middleware/loggedIn');

router.use(csrfProtection);
router.use(loggedIn);

router.route('')  // category
    .get(categoryController.get);

router.route('/add')  //category/add
    .get(categoryController.add)   
    .post(categoryController.save);

router.route('/del/:id')  //category/add
    .get(categoryController.deleteCategory)   

router.route('/:id')  //category/id
    .get(categoryController.getById)




module.exports = router;