var express         = require('express');
var router          = express.Router();

var Story			= require('../models/story');


/* Delete Comment */
router.get('/del/:story&:comment', function(req, res) {        
    Story.findByIdAndUpdate(req.params.story,{
        $pull : {
            'comments' : {
                _id : req.params.comment
            }
        }
    },function(err,doc){
        if(err) throw err;

        req.flash('success','Comment deleted successfully');
        res.redirect(req.header('Referer') || '/');         
    });    
});

/* Save Comment */
router.post('/', function(req, res) {
    var comment = {
        user : {
            id : req.user._id,
            username : req.session.slug,
            email : req.user.email
        },
        message : req.body.comment
    };
    Story.findById(req.body.postid,function(err,story){
        if(err) throw err;

        story.comments.push(comment);
         story.save(function(err,result){
            if(err) throw err;

            req.flash('success','Comment added successfully');
            res.redirect(req.header('Referer') || '/');            
         });        
    });
});

module.exports = router;