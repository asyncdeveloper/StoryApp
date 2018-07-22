module.exports =   function loggedIn(req,res,next){
    if(req.isAuthenticated()){    
        return next();
    }else{
        //Allow specific routes      /story/{id}  
        var regex = /^story\/([0-9a-zA-Z]{1,})$/;        
        var path  = req.originalUrl.replace('/','');                    
        if(regex.test(path))        
            return next();              
        else
            res.redirect('/login');
            
    }
        
}
