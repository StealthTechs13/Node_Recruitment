const mongoose=require('mongoose');
const SignUpSchema=mongoose.Schema({
    name:{type:String},
    email:{type:String},
    password:{type:String},
    countrylist:{type:String},
    phone:{type:Number},
    location:{type:String},
    company_website:{type:String},
    role:{type:String}, // candidate and employer
    package_name:{type:String},
    status:{type:Number},//0 for de-active or new request,1 for active or approved, 2 for rejected , 3 for trash
    login_type_status:{type:Number}, //0, 1, 2, 3, 4, 5
    post_type_status:{type:Number},   //0,1
    created_at:{type:Date, default: Date.now},
    jwtToken:{type:String},
    document_Path:{type:String},
    typeStatus:{type:String}
});

module.exports=mongoose.model('signup',SignUpSchema);