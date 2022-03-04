const mongoose=require('mongoose');
const LetsgotabSchema=mongoose.Schema({
	candidate_id:{type:String},
    candidateIdJoin: {
    type: mongoose.Schema.Types.ObjectId, ref:'signups'},
     c_job_title:{type:String},
    job_type: {type:String},
    for_who:{type:String},
    sector: [String],
    skills:[String],
    experience:[String],
    //specific_project_experience: {type:String},
    //first_language:[String],
    current_status:{type:String}, 
    link_github: {type:String},
    link_linkedin: {type:String},
    //your_website: {type:String},
    //relevent_project_work_links: [String],
    cv_upload: {type:String},
    skill_assessment_upload: {type:String},
    reference_upload:{type:String},
    created_at:{type:Date, default: Date.now}
   


});

module.exports=mongoose.model('letsgotab',LetsgotabSchema);


/*

const mongoose=require('mongoose');
const LetsgotabSchema=mongoose.Schema({
	candidate_id:{type:String},
     call_request:{type:Date},
    linkedin_profile:{type:String},
    github_link:{type:String},
    candidate_sector:{type:String},
    c_specialism:[String],//0 for active,1 for block,2 for delete 
    created_at:{type:Date, default: Date.now}
   
    
});

module.exports=mongoose.model('letsgotab',LetsgotabSchema);

*/













// const mongoose=require('mongoose');
// const LetsgotabSchema=mongoose.Schema({
// 	candidate_id:{type:String},
//     c_job_title:{type:Date},
//     for_who:{type:String},
//     primary_skills:[String],
//     experience:{type:String},
//     additional_skills:[String],//0 for active,1 for block,2 for delete 
//     project_experience:{type:String},
//     first_language:{type:String},
//     cv:{type:String},
//     git_link:{type:String},
//     website:{type:String},
//     skills_upload:{type:String},
//     work_links:[String],
//     referance_uploads:{type:String},
//     created_at:{type:Date, default: Date.now}
// });

// module.exports=mongoose.model('letsgotab',LetsgotabSchema);