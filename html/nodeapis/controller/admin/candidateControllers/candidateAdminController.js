const signupDB = require('../../../model/candidate.model');
const letsgoTab = require('../../../model/details_first_tab.model'); 
const degreetab = require('../../../model/details_second_tab.model'); 
const qualificationtab = require('../../../model/details_second_tab.model'); // current
const currentjobtab = require('../../../model/details_third_tab.model');
const targettab = require('../../../model/details_third_tab.model'); // current
//const targetjobtab = require('../../../model/details_forth_tab.model');
const intereststab = require('../../../model/details_forth_tab.model');//current


var jwt = require('jsonwebtoken');
var nodemailer = require('nodemailer');
var config = require('../../../config/db.js');
module.exports = {


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



//-------------------------------------------------- get matched acandidate details------------------------------------
getMatchedCandidate:function(req,res){
	   // let value =["Web Developer", "Angular"];
	   let value = req.body.e_specialism;
		console.log(req.body.e_specialism,req.body.post,req.body.job_type);
				   
					signupDB.aggregate([

											{
												$lookup:
												{
													from: "targetjobtabs",
													localField: "_id",
													foreignField: "candidateIdJoin",
													as: "idealjob"
												}
											},
											

											{
												$lookup:
												{
													from: "letsgotabs",
													localField: "_id",
													foreignField: "candidateIdJoin",
													as: "idealskill"
												}
											},

											

											{
												"$addFields": {
													"idealskill": {
														"$map": {
															"input": "$idealskill",
															"as": "item",
																"in": {
																	"skills": {
																		"$filter": {
																			"input": "$$item.skills",
																			"as": "elt",
																					cond: {
																						$in: ["$$elt", value],
																					},
																		}
																	}
																}
														}
													}
												}
											},

											{ $match: { $and : [
												{'login_type_status':4},
												{'role': "candidate"},
												//{'idealjob.t_job_title':req.body.post},
												{'idealjob.type_role':req.body.job_type},
												//{'idealskill.skills': { $in: [req.body.e_specialism]}},
												// {'idealskill.skills':req.body.e_specialism},
												// {"idealskill.skills": { "$in": "Web Developer" }},

									        		]}
											},


											
											{
												$project: {
													name: 1,
													"idealjob.t_job_title": 1,
													"idealjob.type_role": 1,
													"idealjob.candidate_id": 1,
													"idealjob.candidateIdJoin": 1,
													//"idealskill.skills": 1,
													//"idealskill.candidate_id": 1,
													//"idealskill.candidateIdJoin": 1,
													'idealskill': {$arrayElemAt:["$idealskill",0]},
													//'idealskill': "$idealskill",
												}
											}
									    ]).exec( function (err, matchedCandidate) {
									    	console.log(matchedCandidate);
												res.send({
												"code": 200,
												"matchedCandidate":matchedCandidate,
												"message":"Successfully Found Record"
												});
										})
 
},
}




















// signupDB.aggregate([
	// 	 {"$match":{"role":'candidate', "login_type_status":4}},
	//    {
	//      $lookup:
	//        {
	//          from: "targettab",
	//          localField: "_id",
	//          foreignField: "candidate_id",
	//          as: "docs"
	//        }
	//   },
	//    {"$unwind":"$targettab"},
 //  		{"$match":{"targettab.t_job_title":postTitle, "targettab.job_type":postTitle}}
	// ]).toArray(function(err, res) {
	//     if (err) throw err;
	//     console.log(JSON.stringify(res));
	    // db.close();
  //});
// 
// var where={'role': "candidate", 'login_type_status': 4}
// 	signupDB.find(where, function (err, candidatestatus){
// 		if(err){
// 			res.send({
// 				"code": 400,
// 				"result":err.message,
// 				"message":"Error while getting record"
// 			});
// 		}else{
// 			if(Boolean(candidatestatus)){
// 				// var postTitle = req.body.post;
// 				// var jobType = req.body.job_type; 
// 				// console.log(postTitle,jobType);
// 				//var where = {'type_role': jobType ,'t_job_title': postTitle};
// 				var where = {'type_role': "permanent", 't_job_title':"aws developer" };
// 				targettab.find(where, function (err, targettabdata){
// 					console.log(targettabdata);
// 					if(err){
// 						res.send({
// 							"code": 400,
// 							"result":err.message,
// 							"message":"Error while getting record"
// 						});
// 					}else{
// 							res.send({
// 							"code": 200,
// 							"result":candidatestatus,
// 							 "targettabdata":targettabdata,
// 							"message":"Successfully get data"
// 					});
// 					}	
// 				});
// 			}else{
// 				res.send({
// 					"code": 400,
// 					"result":'',
// 					"message":"can't find"
// 				});
// 			}
// 		}
		
// 	});

//-----------------------------------------candidate match new code------------------------

// var where={'role': "candidate", 'login_type_status': 4}
// 	signupDB.find(where, function (err, candidatestatus){
// 		if(err){
// 			res.send({
// 				"code": 400,
// 				"result":err.message,
// 				"message":"Error while getting record"
// 			});
// 		}else{
// 			if(Boolean(candidatestatus)){
				
// 					targettab.aggregate([
// 											{ $match: { $and : [
// 												{'t_job_title':req.body.post},
// 												{'type_role': req.body.job_type}
// 									        		]}
// 											},

// 											{
// 												$lookup:
// 												{
// 													from: "targetjobtabs",
// 													localField: "_id",
// 													foreignField: "candidateIdJoin",
// 													as: "idealjob"
// 												}
// 											},

											
// 											{
// 												$project: {
// 													name: 1,
													
// 												}
// 											}
// 									    ]).exec( function (err, posts) {
// 												res.send({
// 												"code": 200,
// 												"totalPosts":posts,
// 												"message":"Successfully Found Record"
// 												});
// 										})
// 			}else{
// 				res.send({
// 					"code": 400,
// 					"result":'',
// 					"message":"can't find"
// 				});
// 			}
// 		}
		
// 	});


// exports.getRecevierPostAllList = function (req, res) {
// console.log('req.body ----------', req.body)
// var token = req.headers['x-access-token'];
// var response = {};
// var postData = req.body;
// var required_params = ['agencyId'];
// var elem = functions.validateReqParam(postData, required_params);
// var valid = elem.missing.length == 0 && elem.blank.length == 0;
// if(!token){
// return res.status(400).send(messages.TOKEN_NOT_PROVIDED);

// }else{
// if (valid) {
// jwt.verify(token, config.secret, function(err, decoded) {
// if (err){
// return res.status(401).send(messages.AUTH_TOKEN_FAIL);

// }else{

// var userwhere = {'_id':decoded.id, 'agencyId': req.body.agencyId}
// // var where = {'receiverid':decoded.id, 'agencyId': req.body.agencyId}
// User.find(userwhere,function (err,Userdata){
// if(err){
// res.send({
// "code": 400,
// "result":err.message,
// "message":"Error while find record"
// });
// }else{

// postHealthAndDetailsModel.aggregate([
// { $match: { $and : [
// {'receiverid':decoded.id},
// {'agencyId': req.body.agencyId}
// ]}
// },

// {
// $lookup:
// {
// from: "postsreligions",
// localField: "_id",
// foreignField: "postIdJoin",
// as: "religions"
// }
// },

// {
// $lookup:
// {
// from: "postpreferences",
// localField: "_id",
// foreignField: "postIdJoin",
// as: "preferences"
// }
// },
// {
// $project: {
// receiverid: 1,
// agencyId: 1,
// any_health_prob: 1,
// any_health_prob_text: 1,
// any_allergies: 1,
// any_allergies_text: 1,
// religions: {$arrayElemAt:["$religions",0]},
// preferences: {$arrayElemAt:["$preferences",0]},
// }
// }
// ]).exec( function (err, posts) {
// res.send({
// "code": 200,
// "totalPosts":posts,
// "message":"Successfully Found Record"
// });
// })
// }
// })
// }
// })
// }else{
// var str = functions.loadErrorTemplate(elem);
// response.status = 0;
// response.message = messages.WRONG_MISSING_PARAM + str;
// res.send(response);
// }
// }
// }