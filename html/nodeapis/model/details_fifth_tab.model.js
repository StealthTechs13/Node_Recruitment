const mongoose=require('mongoose');
const TargettabSchema=mongoose.Schema({
	candidate_id:{type:String},
    intro_video:{type:String},
    created_at:{type:Date, default: Date.now}
});

module.exports=mongoose.model('targetjobtabb',TargettabSchema);