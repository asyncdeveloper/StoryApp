var mongoose = require('mongoose');
var Schema   = mongoose.Schema;


var categorySchema   = new Schema ({
    name: { type : String , required: true }     
},{ timestamps :true });

module.exports = mongoose.model('Category',categorySchema);