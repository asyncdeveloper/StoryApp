var Category = require('./../models/category.js');

var categoryController = function(Category){
    var get = function (req,res){        
        Category.find().sort({'name' : 'asc'}).find(function(err,categories){
            if(err) throw err;           
                                           
            var message  = req.flash('success');                
            var errorMsg = req.flash('error');                
            res.render('category/index', {
                title: 'View Categories' ,
                categories : categories,
                successMsg : message,
                hasErrors : errorMsg.length > 0,
                messages : errorMsg
            });            
        });
    };
    var add = function (req,res){
        var messages = req.flash('error');                
        res.render('category/add', {
            title :'Add Category',
            csrfToken : req.csrfToken() ,
            hasErrors : messages.length > 0,
            messages : messages            
        });
    };
    var save = function(req,res){
        req.checkBody("name",  "Name must be at least four characters").isLength({ min:4 });                
        var errors = req.validationErrors();
        if (errors) {
            var messages = [];
            errors.forEach(function(error) {
                messages.push(error.msg);
            });        
            req.flash("error", messages);
            res.redirect(req.header('Referer') || '/');                        
        }else{            
            var category = new Category({ name : req.body.name });                    
            category.save(function(err, result) {
                if (err) {
                    messages.push(error.msg);
                    req.flash("error", messages);
                    res.redirect(req.header('Referer') || '/');                        
                }                                                
                req.flash('success','Category saved successfully');
                res.redirect('/category');                                                                            
            });        
        }        
    };
    var getById = function(req,res) {
        Category.findById(req.params.id,function(err,category){
            if(err) throw err;
                              
            res.render('category/edit',{
                title: 'Edit Category '
            });            
        });
    };
    var deleteCategory = function(req,res){
        Category.findByIdAndRemove(req.params.id,function(err,data){
            if(err) throw err;

            req.flash("success", "Category deleted successfully");
            res.redirect('/category');                               
        });        
    };

    return {
        get : get ,
        add : add ,
        save : save,
        getById : getById,
        deleteCategory : deleteCategory
    }
    
};

module.exports = categoryController;