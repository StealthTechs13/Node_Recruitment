const mongoose=require('mongoose');
const CampaigndetailstabSchema=mongoose.Schema({
	emp_id:{type:String},
	post:{type:String},
    job_type:{type:String},
    office_address:{type:String},
    e_currencylist:[String],
    salary:[String],
    experience_level:{type:String},    
    created_at:{type:Date, default: Date.now}
});

module.exports=mongoose.model('campaigndetailstab',CampaigndetailstabSchema);





