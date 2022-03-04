const mongoose=require('mongoose');
const CampaignquestiontabSchema=mongoose.Schema({
	emp_id:{type:String},
	post_id:{type:String}, 
    ques:[String], 
    created_at:{type:Date, default: Date.now}
});

module.exports=mongoose.model('campaignquestab',CampaignquestiontabSchema);