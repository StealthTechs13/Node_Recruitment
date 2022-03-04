const mongoose=require('mongoose');
const PackagehistorySchema=mongoose.Schema({
	user_id:{type:String},
    plan_name:{type:String},
    plan_amount:{type:Number},
    plan_description:{type:String},
    access_fee:{type:String},
    success_fee:{type:Number},
    plan_time:{type:String},
    created_at:{type:Date, default: Date.now}
});

module.exports=mongoose.model('packageHistory',PackagehistorySchema);