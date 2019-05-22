var Story              = require('./../models/story');
var Category           = require('./../models/category');

var storyController    = function(Story){
    var get = function(req,res) {
        Story.find({
            'user.username' : req.session.slug
        }).sort({'createdAt': 'desc'}).find(function(err,stories){
            if(err) throw err;

            var message  = req.flash('success');                
            var errorMsg = req.flash('error');                
            res.render('story/index', { 			
                title: 'View Stories' ,
                stories : stories,
                successMsg : message,
                hasErrors : errorMsg.length > 0,
                messages : errorMsg
            });
        })
    };
    var add = function(req,res){        
        Category.find(function(err,category){
            if(err) throw err;
            var errorMsg = req.flash('error');                            
            res.render('story/add', {                
                title: 'Add Story' ,
                categories : category,
                hasErrors : errorMsg.length > 0,
                messages : errorMsg
            });   
        });        
    };
    var save = function(req,res){
        req.checkBody("title",  "Invalid Post Name").isLength({ min:4 });                
        req.checkBody("category",  "Kindly Choose a Category").notEmpty();                
        req.checkBody("body",  "Invalid Body").notEmpty();                
        var errors = req.validationErrors();       
        if (errors) {                        
            var messages = [];
            errors.forEach(function(error) {
                messages.push(error.msg);
            }); 
            req.flash("error", messages);
            res.redirect(req.header('Referer') || '/');                                                                                                                                                                          
        } 
        else {
            var story = new Story({                
                title : req.body.title,
                body : req.body.body,
                category :  req.body.category ,
                user : {
                    id : req.user._id,
                    username : req.session.slug,
                    email : req.user.email
                }                
            });
            story.save(function(err,result){            
                if(err) {                                    
                    req.flash("error",err);
                    res.redirect(req.header('Referer') || '/');                                                                                                                                                       
                }                     
                req.flash('success','Story saved successfully');
                res.redirect('/story');                                                                                                                               
            });                                                               
        }                         
    };
    var getById = function(req,res){
        Story.findById(req.params.id,function(err,story){
            if(err) throw err;
        
            if(req.route.path === '/edit/:id'){
                Category.find(function(err,category){
                    if(err) throw err;                    

                    var errorMsg = req.flash('error');                
                    res.render('story/edit', {
                        csrfToken : req.csrfToken(),
                        title : 'Edit Story',
                        categories : category,
                        story : story,
                        hasErrors : errorMsg.length > 0,
                        messages : errorMsg
                    });                    
                });                        
            }else{                       
                var messages = req.flash('success');                
                res.render('story/show',{
                    title : 'View Story',
                    story : story,
                    successMsg : messages
                });
            }                        
        });
    };
    var update = function(req,res){      
        req.checkBody("title",  "Invalid Post Name").isLength({ min:4 });                
        req.checkBody("category",  "Kindly Choose a Category").notEmpty();                
        req.checkBody("body",  "Invalid Body").notEmpty();                
        var errors = req.validationErrors();       
    
        if (errors) {                        
            var messages = [];
            errors.forEach(function(error) {
                messages.push(error.msg);
            });        
            req.flash("error", messages);
            res.redirect(req.header('Referer') || '/');
        } else {
            var story  = {
                title: req.body.title,    
                body:  req.body.body,
                category : req.body.category
            };       
            Story.update({ _id: req.params.id}, story, function(err, story) {
                if (err) throw err;            
                
                req.flash('success','Story updated successfully');
                res.redirect('/story');                                                                                                    
            });                  
        }        
    };
    var deleteStory = function(req,res){
        Story.findByIdAndRemove(req.params.id,function(err,data){
            if(err) throw err;

            req.flash('success','Story deleted successfully');
            res.redirect('/story');                                                                                                    
        });        
    };

    return {
        get : get,
        add : add,
        save: save,
        getById : getById,
        update : update,
        deleteStory : deleteStory
    }
}

module.exports = storyController;