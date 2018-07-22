var express               = require('express');
var router                = express.Router();
var csrf                  = require('csurf') ;
var csrfProtection        = csrf();
var Story                 = require('./../models/story');
var storyController       = require('../controllers/storyController')(Story);

var loggedIn              = require('../middleware/loggedIn');

router.use(loggedIn);
router.use(csrfProtection);

router.route('')  // story
    .get(storyController.get);
        
router.route('/add')  //story/add
    .get(storyController.add)
    .post(storyController.save);

router.route('/del/:id')  //story/del/id
    .get(storyController.deleteStory);

router.route('/edit/:id')  // story/edit/id    
    .get(storyController.getById)
    .post(storyController.update);

router.route('/:id')  // story/id
    .get(storyController.getById);


module.exports = router;