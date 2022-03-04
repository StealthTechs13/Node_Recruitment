const signupDB = require('../model/candidate.model');
const packageDB = require('../model/package.model');
const packagehistoryDB = require('../model/package_history.model');
const employerpackageDB = require('../model/employer_package_details.model');
var jwt = require('jsonwebtoken');
var nodemailer = require('nodemailer');
var config = require('../config/db.js');
module.exports = {
	/**************** New Candidate Registeration *****************/
	addPackagename: function(req, res){
		console.log('fgdf');
		if(req.body.packagename!=''){
			var token = req.headers['x-access-token'];
			if (!token) {
				res.send({
					'status':false,
					'result':"No token provided."
				});
			}else{
				jwt.verify(token, config.secret, function(err, decoded) {
					if (err){
						res.send({
							'status':false,
							'result':"Failed to authenticate token."
						});
					}else{
						signupDB.findById(decoded.id,function (err,employerdata){
							if(err){
								res.send({
									"code": 400,
									"result":err.message,
									"message":"Error while enter find record"
								});
							}else{
								if(Boolean(employerdata)){
									console.log(employerdata);
									employerdata.package_name=req.body.packagename;
									employerdata.login_type_status=0; // after choose plan by employer 
									employerdata.save(function (err){
										if(err){
											res.send({
												"code": 400,
												"result":err.message,
												"message":"Error while enter record"
											});
										}else{
											var where={'plan_name':req.body.packagename};
											packageDB.find(where, (err, docs) => {
												if(docs.length>0){
													let historyDB = new packagehistoryDB();
													historyDB.user_id=decoded.id;
													historyDB.plan_name=docs[0].plan_name;
													historyDB.plan_amount=docs[0].plan_amount;
													historyDB.plan_description=docs[0].plan_description;
													historyDB.access_fee=docs[0].access_fee;
													historyDB.success_fee=docs[0].success_fee;
													historyDB.plan_time=docs[0].plan_time;
													historyDB.save(function (err){
														if(err){
															res.send({
																"code": 400,
																"result":err.message,
																"message":"Error while saving record"
															});
														}else{
															let employerdetailsDB = new employerpackageDB();
															employerdetailsDB.user_id=decoded.id;
															employerdetailsDB.plan_name=docs[0].plan_name;
															employerdetailsDB.plan_amount=docs[0].plan_amount;
															employerdetailsDB.plan_description=docs[0].plan_description;
															employerdetailsDB.access_fee=docs[0].access_fee;
															employerdetailsDB.success_fee=docs[0].success_fee;
															employerdetailsDB.plan_time=docs[0].plan_time;
															employerdetailsDB.save(function (err){
																if(err){
																	res.send({
																		"code": 400,
																		"result":err.message,
																		"message":"Error while saving record"
																	});
																}else{
																	res.send({
																		"code": 200,
																		"result":docs,
																		"message":"Successfully save record"
																	});
																}
															});
														}
													});
												}else if(err){
													res.send({
														"code": 400,
														"result":err.message,
														"message":"Error while getting record"
													});
												}else{
													res.send({
														"code": 500,
														"result":"",
														"message":"No record found"
													});
												}
											});
										}
									});
								}else{
									res.send({
										"code": 400,
										"result":"",
										"message":"Not find employer"
									});
								}
							}
						});
					}
				});
			}
		}else{
			res.send({
				"code": 400,
				"result":"",
				"message":"Please fill all the fields"
			});	
		}
	},

	
}

