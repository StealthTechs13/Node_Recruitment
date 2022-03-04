const signupDB = require('../../../model/candidate.model');
const adminDB = require('../../../model/admin.model');


var jwt = require('jsonwebtoken');
var nodemailer = require('nodemailer');
var config = require('../../../config/db.js');
module.exports = {
	/**************** New Candidate Registeration *****************/
	addAdmin: function(req, res){
		if(req.body.admin_email != '' && req.body.admin_password != ''){
			let Admin = new adminDB();
			Admin.admin_email = req.body.admin_email;
			Admin.admin_password = req.body.admin_password;
			Admin.status=0;
			Admin.save((err, doc) => {
				if(err){
					res.send({
						"code": 400,
						'result':err.message, 
						"message":"Admin Email Already Exist"
					});
				}else{
					console.log(doc._id);
					var token = jwt.sign({id: doc._id }, config.secret, {
					expiresIn: 86400 // expires in 24 hours
				});
					Admin.jwtToken = token;
					Admin.save(function (err){
						if (err) {
							res.send({
								'code':400,
								'result':err.message,
								'message':"Email Or Phone Number Is Already Exist.",
							});
						}else{
							res.send({
								"code": 200,
								"result": token,
								"message":"Successfully Sign Up New Admin"
							});
						}
					});
				}
			});
		}else{
			res.send({
				"code": 400,
				"result": 'Please Fill All Required Fields',
				"message":""
			});
		}
	},
//--------- Admin Sign IN ----------------
adminSignIn: function(req, res){
	if(req.body.admin_email !='' && req.body.admin_password !=''){
		var where ={'admin_email':req.body.admin_email,'admin_password':req.body.admin_password}
		adminDB.find(where,(err, docs) => {
			if(docs.length>0){
				console.log(docs[0]._id);
				var token = jwt.sign({id: docs[0]._id }, config.secret, {
					expiresIn: 86400 // expires in 24 hours
				});
				var newvalues = { $set: {'jwtToken': token,} };
				adminDB.updateOne(where,newvalues, function(err, doc){
					if(err){
						res.send({
							"code": 400,
							"result": err,
							"message":"Not Update Token. Error while login!!!!"
						});
					}else{
						res.send({
							"code": 200,
							"result": docs,
							"data":doc,
							"message":"Admin Login Successfully"
						});
					}
				});				
			}else{
				res.send({
					"code": 400,
					"result": err,
					"message":"Invalid Credentials"
				});
			}
		});
	}else{
		res.send({
			"code": 200,
			"result":'',
			"message":"Please Fill All Fields"
		});
	}
},
//---------- Only For Testing Purpose -------------
getallData:function(req,res){
	var cuniversity = ["shimla", "hamirpur", "chandigarh"];
	var cqualification = ["10", "+2", "B.S.C"];
	let Candidatetest = new testDB();
	Candidatetest.university = cuniversity;
	Candidatetest.qualification = cqualification;
	Candidatetest.save(function (err){
		if(err){
			res.send({
				"code": 400,
				"result":err.message,
				"message":"Error while enter record"
			});
		}else{
			res.send({
				"code": 200,
				"result":'',
				"message":"Successfully enter record"
			});
		}
	});
},

democheck:function(req,res){
const accountSid = 'AC58edbfc17d838a6c7768fbf51b35f870'; 
const authToken = '0f76918d7b9da2bc5f1d19d33965e8be'; 
const client = require('twilio')(accountSid, authToken);
client.messages 
      .create({ 
         body: 'Hello', 
         from: '+19203103122', 
         messagingServiceSid: 'MG1352b6378a78842b0faf2a4a99f08f78', 
         mediaUrl: 'rwe',     
         to: '+919671295056' 
       }) 
      .then(message => console.log(message.sid)) 
      .done();
},



}

