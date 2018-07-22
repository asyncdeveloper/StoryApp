var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var commmentSchema = new Schema({
    user: { type : Object , required: true } ,    
    message: { type : String , required: true }                
},{ timestamps :true });

var storySchema   = new Schema ({
    title: { type : String , required: true } ,    
    body: { type : String , required: true } ,
    category : { type : String , required: true },
    user : { type : Object, required : true },    
    comments : [commmentSchema]
},{ timestamps :true });
module.exports = mongoose.model('Story',storySchema);