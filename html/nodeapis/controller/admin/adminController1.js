const signupDB = require('../../model/candidate.model');
const adminDB = require('../../model/admin.model');
const letsgoTab = require('../../model/details_first_tab.model'); 
const packageDB = require('../../model/package.model');
const degreetab = require('../../model/details_second_tab.model'); 
const qualificationtab = require('../../model/details_second_tab.model'); // current
const currentjobtab = require('../../model/details_third_tab.model');
const targettab = require('../../model/details_third_tab.model'); // current
const targetjobtab = require('../../model/details_forth_tab.model');
const intereststab = require('../../model/details_forth_tab.model');//current
const packagehistoryDB = require('../../model/package_history.model');
const employerpackageDB = require('../../model/employer_package_details.model');

//-------------------------post tabs of employer------------------------------------
const campaigndetailstab = require('../../model/employer/campaign_details_tab.model'); 
const skillsneedtab = require('../../model/employer/skills_need_tab.model'); 
const companyroledesctab = require('../../model/employer/company_role_desc_tab.model'); 
const campaignquestab = require('../../model/employer/campaign_question_tab.model'); 

var jwt = require('jsonwebtoken');
var nodemailer = require('nodemailer');
var config = require('../../config/db.js');
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
// -------- Get All Canidate Details(According to the role="candidate") --------
getCandidatedetails:function(req,res){

	var status ='';
	var arr=[0,1];
	if(req.body.typeStatus =="new"){
		status = 0;
	}else if(req.body.typeStatus =="approved"){
		status = 1;
	}else if(req.body.typeStatus =="rejected"){
		status = 2;
	}else if(req.body.typeStatus =="all"){
		status = arr;
	}else {
		status =3;
	}

	var where={'status': status, 'role': "candidate"}
	console.log(status);
	//signupDB.find({'status': { $in :arr }, 'role': "candidate"}).exec(function (err, docs){
	signupDB.find(where, function (err, docs){
	//signupDB.find(where, 'role': "candidate"}).exec(function (err, docs){typeStatus':req.body.typeStatus
		if(err){
			res.send({
				"code": 400,
				"result":err.message,
				"message":"Error while getting record"
			});
		}else{
			res.send({
				"code": 200,
				"result":docs,
				"message":"Successfully get data"
			});
		}
	});
},

// -------- Get All Canidate Details(According to the role="employer") --------
getEmployerdetails:function(req,res){
	var status ='';
	var arr=[0,1];
	if(req.body.typeStatus =="new"){
		status = 0;
	}else if(req.body.typeStatus =="approved"){
		status = 1;
	}else if(req.body.typeStatus =="rejected"){
		status = 2;
	}else if(req.body.typeStatus =="all"){
		status = arr;
	}else {
		status =3;
	}
	
	var where={'status': status, 'role': "employer"}
	signupDB.find(where, function (err, docs){
		if(err){
			res.send({
				"code": 400,
				"result":err.message,
				"message":"Error while getting record"
			});
		}else{
			res.send({
				"code": 200,
				"result":docs,
				"message":"Successfully get data"
			});
		}
	});
},
// --------- Add All Pacakage Details ---------------
addPackages:function(req,res){
	if(req.body.plan_name!='' && req.body.plan_amount!='' && req.body.plan_description!='' && req.body.fee!='' && req.body.success_fee!='' && req.body.plan_time!=''){
		
		var where = {'plan_name':req.body.plan_name};		
		packageDB.find(where,(err, docs) => {
			if(err){
				res.send({
					"code": 400,
					"result":err.message,
					"message":"Error while enter the record"
				});
			}else{
				if(docs.length>0){
					res.send({
						"code": 400,
						"result":docs,
						"message":"Already exist plan"
					});
				}else{
					let Pacakages = new packageDB();
					Pacakages.plan_name=req.body.plan_name;
					Pacakages.plan_amount=req.body.plan_amount;
					Pacakages.plan_description=req.body.plan_description;
					Pacakages.access_fee=req.body.fee;
					Pacakages.success_fee=req.body.success_fee;
					Pacakages.plan_time=req.body.plan_time;
					Pacakages.save(function (err){
						if(err){
							res.send({
								"code": 400,
								"result":err.message,
								"message":"Error while enter the record"
							});
						}else{
							res.send({
								"code": 200,
								"result":"",
								"message":"Successfully enter new record"
							});
						}
					});
				}
			}

		});		
	}else{
		res.send({
			"code": 400,
			"result":"",
			"message":"Please fill all fields"
		});
	}
},
// ------------- Get All Packages Details --------
getSubscriptionplans:function(req,res){
	packageDB.find(function (err, docs){
		if(err){
			res.send({
				"code": 400,
				"result":err.message,
				"message":"Error while enter record"
			});
		}else{
			res.send({
				"code": 200,
				"result":docs,
				"message":"Successfully enter record"
			});
		}
	});
},
//------- Get Package Details Acc. To ID ------
getPakagebyId:function(req,res){
	var where={'_id':req.body.id};
	packageDB.findById(where, (err, doc) => {
		if(err){
			res.send({
				"code": 400,
				"result":err.message,
				"message":"Error while getting records"
			});
		}else{
			res.send({
				"code": 200,
				"result":doc,
				"message":"Successfully get records"
			});
		}
	});
},

// ---------- Update Package Details By Id ---------
updatePackagebyid:function(req,res){
	if(req.body.plan_name!='' && req.body.plan_amount!='' && req.body.plan_description!='' && req.body.fee!='' && req.body.success_fee!='' && req.body.plan_time!=''){
		var where={'_id':req.body.id}
		var newvalues={ $set: {'plan_name': req.body.plan_name, 'plan_amount': req.body.plan_amount, 'plan_description': req.body.plan_description, 'access_fee': req.body.fee, 'success_fee': req.body.success_fee, 'plan_time': req.body.plan_time,} };
		employerpackageDB.updateOne(where,newvalues, function(err, doc){
			if(err){
				res.send({
					"code": 400,
					"result": err,
					"message":"Error while update the record!!"
				});
			}else{
				res.send({
					"code": 200,
					"result": doc,
					"message":"Successfully update the record"
				});
			}
		});	
	}else{
		res.send({
			"code": 200,
			"result": doc,
			"message":"Successfully update the record"
		});
	}
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

// -------------- Get Particular Candidate Details ------------
getOnecandidatedetail:function(req,res){
	var where={'_id':req.body.candidate_id}
	signupDB.find(where,(err, basic) => {
		if(docs.length>0){
			signupDB.find(where).populate('you_tab').exec(function(err, youtab) {
				if(err){

				}else{
					res.send({
						"code": 200,
						"basic_details": basic,
						"first_tab": youtab,
						"message":"Get basic details Successfully"
					});
				}
			})
		}else{
			res.send({
				"code": 400,
				"result": err,
				"message":"No candidate details found"
			});
		}
	})
},

//------------------------------------ get candidates detail by ID --------------------------------------

candidateDetailsWithID:function(req,res){
var candidateId = req.body.id;
	signupDB.findById(candidateId,function (err,candidatestatus){
		if(err){
			res.send({
				"code": 400,
				"result":err.message,
				"message":"Error while find record"
			});
		}else{
			if(Boolean(candidatestatus)){
				var where={'candidate_id':candidateId}
				letsgoTab.find(where,function (err,letsgoTabdata){
					if(err){
						res.send({
							"code": 400,
							"result":err.message,
							"message":"Error while find record"
						});
					}else{
						if(Boolean(candidatestatus)){
							var where={'candidate_id':candidateId}
							qualificationtab.find(where,function (err,degreeTabdata){
								if(err){
									res.send({
									"code": 400,
									"result":err.message,
									"message":"Error while find record"
									});
								}else{
									if(Boolean(candidatestatus)){
										var where={'candidate_id':candidateId}
										targettab.find(where,function (err,currentjobTabdata){
											if(err){
												res.send({
													"code": 400,
													"result":err.message,
													"message":"Error while find record"
												});
											}else{
												if(Boolean(candidatestatus)){
													var where={'candidate_id':candidateId}
													intereststab.find(where,function (err,interestsTabdata){
														console.log(interestsTabdata,candidateId);
														if(err){
															res.send({
																"code": 400,
																"result":err.message,
																"message":"Error while find record"
															});
														}else{
															res.send({
																"code": 200,
																"result":candidatestatus,
																"letsgoTabdata":letsgoTabdata,
																"degreeTabdata":degreeTabdata,
																"currentjobTabdata":currentjobTabdata,
																"interestsTabdata":interestsTabdata,
																"message":"Successfully Found Record"
															});
														}
													});
												}
											}
										});
									}
								}
							});//degreetab
						}
					}//degree else
				});//letsgo tab
			}else{
				res.send({
					"code": 400,
					"result":'',
					"message":"Error !!!"
				});
			}//candidatestatus if
		}//candidatestatus else
	})//candidatestatus
},//candidateDetailsWithID

//------------------------------------ get employer detail by ID --------------------------------------

getEmployerdetailsWithID:function(req,res){
	var employeeId = req.body.id;
	signupDB.findById(employeeId,function (err,employerstatus){
		if(err){
			res.send({
				"code": 400,
				"result":err.message,
				"message":"Error while find record"
			});
		}else{
			if(Boolean(employerstatus)){
				var where={'emp_id':employeeId}
				campaigndetailstab.find(where,function (err,campaigndetailstabdata){
					if(err){
						res.send({
							"code": 400,
							"result":err.message,
							"message":"Error while find record"
						});
					}else{
						if(Boolean(employerstatus)){
							var where={'emp_id':employeeId}
							skillsneedtab.find(where,function (err,skillsneedtabdata){
								if(err){
									res.send({
									"code": 400,
									"result":err.message,
									"message":"Error while find record"
									});
								}else{
									if(Boolean(employerstatus)){
										var where={'emp_id':employeeId}
										companyroledesctab.find(where,function (err,companyroledesctabdata){
											if(err){
												res.send({
													"code": 400,
													"result":err.message,
													"message":"Error while find record"
												});
											}else{
												if(Boolean(employerstatus)){
													var where={'emp_id':employeeId}
													campaignquestab.find(where,function (err,campaignquestabdata){
														console.log(campaignquestabdata,employeeId);
														if(err){
															res.send({
																"code": 400,
																"result":err.message,
																"message":"Error while find record"
															});
														}else{
															res.send({
																"code": 200,
																"result":employerstatus,
																"campaigndetailstabdata":campaigndetailstabdata,
																"skillsneedtabdata":skillsneedtabdata,
																"companyroledesctabdata":companyroledesctabdata,
																"campaignquestabdata":campaignquestabdata,
																"message":"Successfully Found Record"
															});
														}
													});
												}
											}
										});
									}
								}
							});//degreetab
						}
					}//degree else
				});//letsgo tab
			}else{
				res.send({
					"code": 400,
					"result":'',
					"message":"Error !!!"
				});
			}//candidatestatus if
		}//candidatestatus else
	})//candidatestatus
},

//------------------------------------ get employer job posted by postID --------------------------------------

getEmployerJobPostWithID:function(req,res){
	var postId = req.body.id;
	console.log(postId);
	campaigndetailstab.findById(postId,function (err,poststatus){
		console.log(poststatus);
		if(err){
			res.send({
				"code": 400,
				"result":err.message,
				"message":"Error while find record"
			});
		}else{
			if(Boolean(poststatus)){
				var where={'post_id':postId}
				skillsneedtab.find(where,function (err,skillsneedtabdata){
					console.log(skillsneedtabdata);
					if(err){
						res.send({
							"code": 400,
							"result":err.message,
							"message":"Error while find record"
						});
					}else{
						if(Boolean(poststatus)){
							var where={'post_id':postId}
							companyroledesctab.find(where,function (err,companyroledesctabdata){
								console.log(companyroledesctabdata);
								if(err){
									res.send({
									"code": 400,
									"result":err.message,
									"message":"Error while find record"
									});
								}else{
									if(Boolean(poststatus)){
										var where={'post_id':postId}
										campaignquestab.find(where,function (err,campaignquestabdata){
										console.log(campaignquestabdata,postId);
											if(err){
												res.send({
												"code": 400,
												"result":err.message,
												"message":"Error while find record"
												});
											}else{
												res.send({
												"code": 200,
												"result":poststatus,												
												"skillsneedtabdata":skillsneedtabdata,
												"companyroledesctabdata":companyroledesctabdata,
												"campaignquestabdata":campaignquestabdata,
												"message":"Successfully Found Record"
												});
											}
										});
									}
								}
										
							});
						}
					}
				});
			}else{
				res.send({
					"code": 400,
					"result":'',
					"message":"Error !!!"
				});
			}
		}
	})
	
},

// ---------- get Package Details By employer Id ---------
getEmployerPackagedetailsWithID:function(req,res){
	var employeeId = req.body.id;

	//console.log(employeeId);
	var where ={'user_id':employeeId}
	employerpackageDB.find(where,function (err,doc){
		if(err){
			res.send({
				"code": 400,
				"result":err.message,
				"message":"Error while enter record"
			});
		}else{
			res.send({
				"code": 200,
				"result":doc,
				"message":"Successfully enter record"
			});
		}
	});
},

// ---------- Activate Package Details By employer Id ---------



activatePackagebyid:function(req,res){
	if(req.body.plan_name!='' && req.body.plan_amount!='' && req.body.plan_description!='' && req.body.fee!='' && req.body.success_fee!='' && req.body.plan_time!=''){
	    //var where={'_id':req.body.id}
		var employeeId = req.body.id;
		var employeeId = req.body.id;
		var plan_name = req.body.plan_name;
		var plan_amount = req.body.plan_amount;
		var plan_time = req.body.plan_time;
		var success_fee = req.body.success_fee;
		var fee = req.body.fee;
		var plan_description = req.body.plan_description;

		console.log(employeeId);
		console.log(plan_name);
		console.log(plan_amount);
		console.log(plan_time);
		console.log(success_fee);
		console.log(fee);
		console.log(plan_description);
		var where ={'_id':employeeId}
		var newvalues={ $set: {'package_name': req.body.plan_name,} };
		signupDB.updateOne(where,newvalues, function(err, doc){
		if(err){
			res.send({
				"code": 400,
				"result":err.message,
				"message":"Error while find record"
			});
		}else{
			if(Boolean(doc)){
				var where ={'user_id':employeeId}
				var newvalues={ $set: {'plan_name': req.body.plan_name, 'plan_amount': req.body.plan_amount, 'plan_description': req.body.plan_description, 'access_fee': req.body.fee, 'success_fee': req.body.success_fee, 'plan_time': req.body.plan_time,} };
		         employerpackageDB.updateOne(where,newvalues, function(err,employerpackageDBdata ){

					if(err){
						res.send({
							"code": 400,
							"result":err.message,
							"message":"Error while find record"
						});
					}else{
							if(Boolean(doc)){
								var where ={'user_id':employeeId}
								var newvalues={ $set: {'plan_name': req.body.plan_name, 'plan_amount': req.body.plan_amount, 'plan_description': req.body.plan_description, 'access_fee': req.body.fee, 'success_fee': req.body.success_fee, 'plan_time': req.body.plan_time, } };
		         				packagehistoryDB.updateOne(where,newvalues, function(err,packagehistoryDBdata ){
									if(err){
										res.send({
											"code": 400,
											"result":err.message,
											"message":"Error while find record"
										});
									}else{
										res.send({
											"code": 200,
											"result":doc,
											"employerpackageDB":employerpackageDB,	
											"packagehistoryDBdata":packagehistoryDBdata,																		
											"message":"Successfully update Record"
										});
										}
								});
							}
						}
					
				});
				
			}else{
				res.send({
					"code": 400,
					"result":'',
					"message":"Error !!!"
				});
			}
		}
	    });
	}else{
		res.send({
			"code": 200,
			"result": doc,
			"message":"Successfully update the record"
		});
	}	
},



//-------------------------------------------------- get matched acandidate details------------------------------------
getMatchedCandidate:function(req,res){
	
	
	var where={'role': "candidate", 'login_type_status': 4}
	signupDB.find(where, function (err, candidatestatus){
		if(err){
			res.send({
				"code": 400,
				"result":err.message,
				"message":"Error while getting record"
			});
		}else{
			if(Boolean(candidatestatus)){
				// var postTitle = req.body.post;
				// var jobType = req.body.job_type; 
				// console.log(postTitle,jobType);
				//var where = {'type_role': jobType ,'t_job_title': postTitle};
				var where = {'type_role': "permanent", 't_job_title':"aws developer" };
				targettab.find(where, function (err, targettabdata){
					console.log(targettabdata);
					if(err){
						res.send({
							"code": 400,
							"result":err.message,
							"message":"Error while getting record"
						});
					}else{
							res.send({
							"code": 200,
							"result":candidatestatus,
							 "targettabdata":targettabdata,
							"message":"Successfully get data"
					});
					}	
				});
			}else{
				res.send({
					"code": 400,
					"result":'',
					"message":"can't find"
				});
			}
		}
		
	});
},


}

