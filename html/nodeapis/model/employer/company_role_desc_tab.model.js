const mongoose=require('mongoose');
const CompanyjobdesctabSchema=mongoose.Schema({
	emp_id:{type:String},
	post_id:{type:String}, 
    website:{type:String},//0 for active,1 for block,2 for delete 
    company_desc:{type:String},
    role_desc:{type:String},      
    created_at:{type:Date, default: Date.now}
});

module.exports=mongoose.model('companyjobdesctab',CompanyjobdesctabSchema);