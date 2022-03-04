const signupDB = require('../../../model/candidate.model');
const packageDB = require('../../../model/package.model');
const packagehistoryDB = require('../../../model/package_history.model');
const employerpackageDB = require('../../../model/employer_package_details.model');

//-------------------------post tabs of employer------------------------------------
const campaigndetailstab = require('../../../model/employer/campaign_details_tab.model'); 
const skillsneedtab = require('../../../model/employer/skills_need_tab.model'); 
const companyroledesctab = require('../../../model/employer/company_role_desc_tab.model'); 
const campaignquestab = require('../../../model/employer/campaign_question_tab.model'); 

var jwt = require('jsonwebtoken');
var nodemailer = require('nodemailer');
var config = require('../../../config/db.js');
module.exports = {
	

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
			console.log(docs.length);

			if(err){
				res.send({
					"code": 400,
					"result":err.message,
					"message":"Error while getting record"
				});
			}else if(docs.length>0){
				res.send({
					"code": 200,
					"result":docs,
					"message":"Successfully get data"
				});
			}else{
				res.send({
					"code": 200,
					"result":'',
					"message":"Record not found"
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
						"message":"Plan already exist."
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
								"message":"Successfully entered new record"
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
//------- Get Package Details Acc. To ID oe edit package------
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

// ---------- Update Package Details By Id  or update package ---------
updatePackagebyid:function(req,res){
	if(req.body.plan_name!='' && req.body.plan_amount!='' && req.body.plan_description!='' && req.body.fee!='' && req.body.success_fee!='' && req.body.plan_time!=''){
		var where={'_id':req.body.id}
		packageDB.deleteOne(where);
		var newvalues={ $set: {'plan_name': req.body.plan_name, 'plan_amount': req.body.plan_amount, 'plan_description': req.body.plan_description, 'access_fee': req.body.fee, 'success_fee': req.body.success_fee, 'plan_time': req.body.plan_time,} };
		packageDB.updateOne(where,newvalues, function(err, doc){
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
				"message":"Error while find record1"
			});
		}else{
			if(Boolean(doc)){
				var where ={'user_id':employeeId}
				employerpackageDB.deleteOne(where);
				var newvalues={ $set: {'plan_name': req.body.plan_name, 'plan_amount': req.body.plan_amount, 'plan_description': req.body.plan_description, 'access_fee': req.body.fee, 'success_fee': req.body.success_fee, 'plan_time': req.body.plan_time,} };
		         employerpackageDB.updateOne(where,newvalues, function(err,employerpackageDBdata ){

					if(err){
						res.send({
							"code": 400,
							"result":err.message,
							"message":"Error while find record2"
						});
					}else{
							if(Boolean(doc)){
								var where ={'user_id':employeeId}
								packagehistoryDB.deleteOne(where);
								var newvalues={ $set: {'plan_name': req.body.plan_name, 'plan_amount': req.body.plan_amount, 'plan_description': req.body.plan_description, 'access_fee': req.body.fee, 'success_fee': req.body.success_fee, 'plan_time': req.body.plan_time, } };
		         				packagehistoryDB.updateOne(where,newvalues, function(err,packagehistoryDBdata ){
									if(err){
										res.send({
											"code": 400,
											"result":err.message,
											"message":"Error while find record3"
										});
									}else{
										res.send({
											"code": 200,
											"result":doc,
											"employerpackageDB":employerpackageDB,	
											"packagehistoryDBdata":packagehistoryDBdata,																		
											"message":"Successfully changed package"
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





}

