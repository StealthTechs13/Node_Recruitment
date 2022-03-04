const candidateDB = require('../../model/candidate.model');
const campaigndetailstab = require('../../model/employer/campaign_details_tab.model'); 
const skillsneedtab = require('../../model/employer/skills_need_tab.model'); 
const companyroledesctab = require('../../model/employer/company_role_desc_tab.model'); 
const campaignquestab = require('../../model/employer/campaign_question_tab.model'); 



var jwt = require('jsonwebtoken');
var nodemailer = require('nodemailer');
var config = require('../../config/db.js');

module.exports = {

testing: function(req, res){
	console.log('fgh');
},
//------------ campaign details first tab------------
tabcampaigndetails:function(req,res){
	console.log('sfds');
	if(req.body.post !='' && req.body.job_type != '' && req.body.office_address != '' && req.body.e_currencylist != '' && req.body.salary != '' && req.body.experience_level != ''){
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
					candidateDB.findById(decoded.id,function(err,employer){
						if (err){
							res.send({
								'status':false,
								'result':"There was a problem finding the employer."
							});
						}else{
							let campaigndetailsTab=new campaigndetailstab();
							campaigndetailsTab.emp_id=decoded.id;
							campaigndetailsTab.post = req.body.post;
							campaigndetailsTab.job_type = req.body.job_type;
							campaigndetailsTab.office_address = req.body.office_address;
							campaigndetailsTab.e_currencylist = req.body.e_currencylist;
							campaigndetailsTab.salary = req.body.salary;
							campaigndetailsTab.experience_level = req.body.experience_level;
							campaigndetailsTab.save(function (err){
								console.log(campaigndetailsTab);
								if(err){
									res.send({
										"code": 400,
										"result":err.message,
										"message":"Error while enter record"
									});
								}else{
									if(Boolean(employer)){
										employer.login_type_status=1;
										employer.save(function(err){
											if(err){
												res.send({
													"code": 400,
													"result":err.message,
													"message":"Error while enter record"
												});
											}else{
												res.send({
													"code": 200,
													"result":"Save Record",
													"message":"Successfully enter record"
												});
											}
										});
									}else{
										res.send({
											"code": 400,
											"result":"Employer Not Found",
											"message":"Successfully Save First Tab Data"
										});
									}
								}
							});
						}

					});
				}
			});
		}
	}else{
		res.send({
			"code": 400,
			"result":"Fields Empty",
			"message":"Please Fill All Fields"
		});
	}
},

//---------------- skills need second tab -------------------
tabskillsneed:function(req,res){
	if(req.body.job_sector!='' && req.body.e_specialism!=''){
	var token = req.headers['x-access-token'];
	if (!token) {
		res.send({
			'status':false,
			'result':"No token provided."
		});
	}else{
		jwt.verify(token, config.secret, function(err, decoded) {
			console.log(decoded);
			if (err){
				res.send({
					'status':false,
					'result':"Failed to authenticate token."
				});
			}else{
				candidateDB.findById(decoded.id,function(err,employer){
					console.log(decoded.id);
					console.log(employer);
					if (err){
						res.send({
							'status':false,
							'result':"There was a problem finding the employer."
						});
					}else{
						var where = {'emp_id':decoded.id};	
						campaigndetailstab.find(where,function(err,postid){
							console.log(postid);
							const lastpostid = postid[postid.length - 1]
							console.log(lastpostid);
							if (err){
								res.send({
									'status':false,
									'result':"Failed to authenticate token."
								});
							}else{
								let SkillsNeedTab=new skillsneedtab();
								SkillsNeedTab.emp_id=decoded.id;
								SkillsNeedTab.post_id=lastpostid._id;
								SkillsNeedTab.job_sector = req.body.job_sector;
								SkillsNeedTab.e_specialism = req.body.e_specialism;
								console.log(SkillsNeedTab);
								SkillsNeedTab.save(function (err){
									if(err){
										res.send({
											"code": 400,
											"result":err.message,
											"message":"Error while enter record"
										});
									}else{
										if(Boolean(employer)){
											employer.login_type_status=2;
											employer.save(function(err){
												if(err){
													res.send({
														"code": 400,
														"result":err.message,
														"message":"Error while enter record"
													});
												}else{
													res.send({
														"code": 200,
														"result":"Save Record",
														"message":"Successfully enter record"
													});
												}
											});
										}else{
											res.send({
												"code": 400,
												"result":"Candidate Not Found",
												"message":"Successfully Save second Tab Data"
											});
										}
									}
								});
						    }
						});
					}//else

				});
}
});
}
}else{
	res.send({
				"code": 400,
				"result":"Empty Fields",
				"message":"Please Fill All Required Fields"
			});
}
},

//---------------- Target company and role description third tab-------------------
tabcompanyroledesc:function(req,res){
	if(req.body.website!='' && req.body.company_desc!=''&& req.body.role_desc!=''){
		var token = req.headers['x-access-token'];
	if (!token) {
		res.send({
			'status':false,
			'result':"No token provided."
		});
	}else{
		jwt.verify(token, config.secret, function(err, decoded) {
			console.log(decoded);
			if (err){
				res.send({
					'status':false,
					'result':"Failed to authenticate token."
				});
			}else{
				candidateDB.findById(decoded.id,function(err,employer){
					console.log(decoded.id);
					console.log(employer);
					if (err){
						res.send({
							'status':false,
							'result':"There was a problem finding the employer."
						});
					}else{
						var where = {'emp_id':decoded.id};	
						campaigndetailstab.find(where,function(err,postid){
							console.log(postid);
							const lastpostid = postid[postid.length - 1]
							console.log(lastpostid);
							if (err){
								res.send({
									'status':false,
									'result':"Failed to authenticate token."
								});
							}else{
								let CompanyRoleDescTab=new companyroledesctab();
								CompanyRoleDescTab.emp_id=decoded.id;
								CompanyRoleDescTab.post_id=lastpostid._id;
								CompanyRoleDescTab.website = req.body.website;
								CompanyRoleDescTab.company_desc = req.body.company_desc;
								CompanyRoleDescTab.role_desc = req.body.role_desc;
								CompanyRoleDescTab.save(function (err){
									if(err){
										res.send({
											"code": 400,
											"result":err.message,
											"message":"Error while enter record"
										});
									}else{
										if(Boolean(employer)){
											employer.login_type_status=3;
											employer.save(function(err){
												if(err){
													res.send({
														"code": 400,
														"result":err.message,
														"message":"Error while enter record"
													});
												}else{
													res.send({
														"code": 200,
														"result":"Save Record",
														"message":"Successfully enter record"
													});
												}
											});
										}else{
											res.send({
												"code": 400,
												"result":"Candidate Not Found",
												"message":"Successfully Save second Tab Data"
											});
										}
									}
								});
						    }
						});
					}//else

				});
}
});
}
}else{
	res.send({
				"code": 400,
				"result":"Empty Fields",
				"message":"Please Fill All Required Fields"
			});
}
},
// 	var token = req.headers['x-access-token'];
// 	if (!token) {
// 		res.send({
// 			'status':false,
// 			'result':"No token provided."
// 		});
// 	}else{
// 		jwt.verify(token, config.secret, function(err, decoded) {
// 			if (err){
// 				res.send({
// 					'status':false,
// 					'result':"Failed to authenticate token."
// 				});
// 			}else{
// 				candidateDB.findById(decoded.id,function(err,employer){
// 					if (err){
// 						res.send({
// 							'status':false,
// 							'result':"There was a problem finding the employer."
// 						});
// 					}else{
// 						let CompanyRoleDescTab=new companyroledesctab();
// 						CompanyRoleDescTab.emp_id=decoded.id;
// 						CompanyRoleDescTab.post_id=postid[0]._id;
// 						CompanyRoleDescTab.website = req.body.website;
// 						CompanyRoleDescTab.company_desc = req.body.company_desc;
// 						CompanyRoleDescTab.role_desc = req.body.role_desc;
// 						CompanyRoleDescTab.save(function (err){
// 							if(err){
// 								res.send({
// 									"code": 400,
// 									"result":err.message,
// 									"message":"Error while enter record"
// 								});
// 							}else{
// 								if(Boolean(employer)){
// 									employer.login_type_status=3;
// 									employer.save(function(err){
// 										if(err){
// 											res.send({
// 												"code": 400,
// 												"result":err.message,
// 												"message":"Error while enter record"
// 											});
// 										}else{
// 											res.send({
// 												"code": 200,
// 												"result":"Save Record",
// 												"message":"Successfully enter record"
// 											});
// 										}
// 									});
// 								}else{
// 									res.send({
// 										"code": 400,
// 										"result":"Candidate Not Found",
// 										"message":"Successfully Save third Tab Data"
// 									});
// 								}
// 							}
// 						});
// 					}

// 				});
// }
// });
// }
// }else{
// 	res.send({
// 				"code": 400,
// 				"result":"Empty Fields",
// 				"message":"Please Fill All Required Fields"
// 			});
// }
// },

//---------------- Questions fourth tab -------------------
tabcampaignques:function(req,res){
	if(req.body.ques!=''){
		var token = req.headers['x-access-token'];
	if (!token) {
		res.send({
			'status':false,
			'result':"No token provided."
		});
	}else{
		jwt.verify(token, config.secret, function(err, decoded) {
			console.log(decoded);
			if (err){
				res.send({
					'status':false,
					'result':"Failed to authenticate token."
				});
			}else{
				candidateDB.findById(decoded.id,function(err,employer){
					console.log(decoded.id);
					console.log(employer);
					if (err){
						res.send({
							'status':false,
							'result':"There was a problem finding the employer."
						});
					}else{
						var where = {'emp_id':decoded.id};	
						campaigndetailstab.find(where,function(err,postid){
							console.log(postid);
							const lastpostid = postid[postid.length - 1]
							console.log(lastpostid);
							if (err){
								res.send({
									'status':false,
									'result':"Failed to authenticate token."
								});
							}else{
								let CampaignQuesTab=new campaignquestab();
								CampaignQuesTab.emp_id=decoded.id;
								CampaignQuesTab.post_id=lastpostid._id;
								CampaignQuesTab.ques = req.body.ques;
								
								CampaignQuesTab.save(function (err){
									if(err){
										res.send({
											"code": 400,
											"result":err.message,
											"message":"Error while enter record"
										});
									}else{
										if(Boolean(employer)){
											employer.login_type_status=4;
											employer.post_type_status=1;
											employer.save(function(err){
												if(err){
													res.send({
														"code": 400,
														"result":err.message,
														"message":"Error while enter record"
													});
												}else{
													res.send({
														"code": 200,
														"result":"Save Record",
														"message":"Successfully enter record"
													});
												}
											});
										}else{
											res.send({
												"code": 400,
												"result":"Candidate Not Found",
												"message":"Successfully Save second Tab Data"
											});
										}
									}
								});
						    }
						});
					}//else

				});
}
});
}
}else{
	res.send({
				"code": 400,
				"result":"Empty Fields",
				"message":"Please Fill All Required Fields"
			});
}
},


//------- Get employer Details Acc. To ID ------
getEmployerbyId:function(req,res){
	var token = req.headers['x-access-token'];
	if (!token) {
		res.send({
			'status':false,
			'result':"No token provided."
		});
	}else{
		jwt.verify(token, config.secret, function(err, decoded) {
			console.log(decoded);
			if (err){
				res.send({
					'status':false,
					'result':"Failed to authenticate token."
				});
			}else{
				var employerId = decoded.id;
				var where = {'_id':employerId}
				candidateDB.findById(where,function (err,employerstatus){
					if(err){
						res.send({
							"code": 400,
							"result":err.message,
							"message":"Error while find record"
						});
					}else{
						if(Boolean(employerstatus)){
							var where={'emp_id':employerId}
							campaigndetailstab.find(where,function (err,campaigndetailstabdata){
								if(err){
									res.send({
										"code": 400,
										"result":err.message,
										"message":"Error while find record"
									});
								}else{
									if(Boolean(employerstatus)){
										var where={'emp_id':employerId}
										skillsneedtab.find(where,function (err,skillsneedtabdata){
											if(err){
												res.send({
												"code": 400,
												"result":err.message,
												"message":"Error while find record"
												});
											}else{
												if(Boolean(employerstatus)){
													var where={'emp_id':employerId}
													companyroledesctab.find(where,function (err,companyroledesctabdata){
														if(err){
															res.send({
																"code": 400,
																"result":err.message,
																"message":"Error while find record"
															});
														}else{
															if(Boolean(employerstatus)){
																var where={'emp_id':employerId}
																campaignquestab.find(where,function (err,campaignquestabdata){
																	console.log(campaignquestabdata,employerId);
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
			}
		});
	}
	
},


//------------------------------------ get employer job posted by postID --------------------------------------

getEmployerJobPostWithID:function(req,res){

// var token = req.headers['x-access-token'];
// 	if (!token) {
// 		res.send({
// 			'status':false,
// 			'result':"No token provided."
// 		});
// 	}else{
// 		jwt.verify(token, config.secret, function(err, decoded) {
// 			console.log(decoded);
// 			if (err){
// 				res.send({
// 					'status':false,
// 					'result':"Failed to authenticate token."
// 				});
// 			}else{
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

	// 			  }
	// 	});
	// }
	
	
},



























































// 	var token = req.headers['x-access-token'];
// 	if (!token) {
// 		res.send({
// 			'status':false,
// 			'result':"No token provided."
// 		});
// 	}else{
// 		jwt.verify(token, config.secret, function(err, decoded) {
// 			if (err){
// 				res.send({
// 					'status':false,
// 					'result':"Failed to authenticate token."
// 				});
// 			}else{
// 				candidateDB.findById(decoded.id,function(err,employer){
// 					if (err){
// 						res.send({
// 							'status':false,
// 							'result':"There was a problem finding the employer."
// 						});
// 					}else{
// 						let CampaignQuesTab=new campaignquestab();
// 						CampaignQuesTab.emp_id=decoded.id;
// 						CampaignQuesTab.post_id=postid[0]._id;
// 						CampaignQuesTab.ques = req.body.ques;
						
// 						CampaignQuesTab.save(function (err){
// 							if(err){
// 								res.send({
// 									"code": 400,
// 									"result":err.message,
// 									"message":"Error while enter record"
// 								});
// 							}else{
// 								if(Boolean(employer)){
// 									employer.login_type_status=4;
// 									employer.post_type_status=1;
// 									employer.save(function(err){
// 										if(err){
// 											res.send({
// 												"code": 400,
// 												"result":err.message,
// 												"message":"Error while enter record"
// 											});
// 										}else{
// 											res.send({
// 												"code": 200,
// 												"result":"Save Record",
// 												"message":"Successfully enter record"
// 											});
// 										}
// 									});
// 								}else{
// 									res.send({
// 										"code": 400,
// 										"result":"Candidate Not Found",
// 										"message":"Successfully Save fourth Tab Data"
// 									});
// 								}
// 							}
// 						});
// 					}

// 				});
// }
// });
// }
// }else{
// 	res.send({
// 				"code": 400,
// 				"result":"Empty Fields",
// 				"message":"Please Fill All Required Fields"
// 			});
// }
// },



}


//module.exports.run=run;