const mongoose=require('mongoose');
const AdminSchema=mongoose.Schema({
    admin_email:{type:String,required:true,unique: true},
    admin_password:{type:String,required:true},
    status:{type:Number ,required:true},//0 for active,1 for block,2 for delete
    created_at:{type:Date, default: Date.now},
    jwtToken:{type:String},
    typeStatus:{type:String}
});

module.exports=mongoose.model('admin',AdminSchema);