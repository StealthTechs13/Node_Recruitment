const express = require("express")
const router = express.Router()
const candidateController = require("../controller/candidateController")
const candidatedetailsController = require("../controller/candidate_details_tab_Controller")
var multer = require('multer');
var fs = require('fs');

//------------------ For Video/Image Upload -------------
const upload = require('../config/multer.config.js');

//-------------------- For CV upload

var storage = multer.diskStorage({
destination: function (req, file, cb) {
var dir = './uploads/candidate/cv/';
if (!fs.existsSync(dir)) {
fs.mkdirSync(dir);
}
cb(null, './uploads/candidate/cv/')
},
filename: function (req, file, cb) {
const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
cb(null, file.fieldname + '-' + uniqueSuffix)
}
})
var uploadQuestionImage = multer({ storage: storage })

//----------------------- For skills upload------------------------

var storage1 = multer.diskStorage({
destination: function (req, file, cb) {
var dir = './uploads/candidate/skills/';
if (!fs.existsSync(dir)) {
fs.mkdirSync(dir);
}
cb(null, './uploads/candidate/skills/')
},
filename: function (req, file, cb) {
const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
cb(null, file.fieldname + '-' + uniqueSuffix)
}
})
var uploadQuestionImage1 = multer({ storage: storage1 })

//-------------------------For Reference upload-------------------------

var storage2 = multer.diskStorage({
destination: function (req, file, cb) {
var dir = './uploads/candidate/reference/';
if (!fs.existsSync(dir)) {
fs.mkdirSync(dir);
}
cb(null, './uploads/candidate/reference/')
},
filename: function (req, file, cb) {
const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
cb(null, file.fieldname + '-' + uniqueSuffix)
}
})
var uploadQuestionImage2 = multer({ storage: storage2 })

//-------------------------For video upload-------------------------

var storage3 = multer.diskStorage({
destination: function (req, file, cb) {
var dir = './uploads/candidate/videoupload/';
if (!fs.existsSync(dir)) {
fs.mkdirSync(dir);
}
cb(null, './uploads/candidate/videoupload/')
},
filename: function (req, file, cb) {
const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
cb(null, file.fieldname + '-' + uniqueSuffix)
}
})
var uploadQuestionImage3 = multer({ storage: storage3 })

//------------------- Routes For Candidate Side -------------------
router.post("/candidateSignup", candidateController.addCandidate)
router.post("/candidateLogin", candidateController.candidateSignIn)
router.post("/test", candidateController.testingdata)
router.get("/getDetails", candidateController.getdata)
router.post("/firstTab", candidatedetailsController.letsgotab)  //delete
router.post("/secondTab", candidatedetailsController.degreetabdata)  //delete
router.get("/statusGet", candidateController.getstatus)   
router.post("/statusUpdate", candidateController.changestatus)
router.post("/tabLetsgo", candidatedetailsController.letsgotab) // candidate details tab api call
router.post("/degreetab", candidatedetailsController.degreetabdata)
router.post("/candidateTrash", candidateController.trashCandidate)
router.post("/currentTab", candidatedetailsController.currentjobtabdata)
router.post("/targetTab", candidatedetailsController.targetjobtabdata) //delete
router.post("/uploadTab", candidatedetailsController.uploadtabdata)
router.post("/uploadVideo", candidatedetailsController.saveimagevideo)
router.post("/testing", candidatedetailsController.run)
router.post("/youTab", candidatedetailsController.youtabdata)
router.post("/qualification",candidatedetailsController.qualification)
router.post("/jobIdealTab",candidatedetailsController.targetjobtabs)
router.post("/interestsTab",candidatedetailsController.interests)
router.post("/candidateReject", candidateController.rejectCandidate)
router.post("/updateCandidate", candidateController.updateCandidatebyid)   //  interest
router.post("/updateCandidateLetsgo", candidateController.updateCandidateFirstTabbyid)
router.post("/updateCandidateQualification", candidateController.updateCandidateQualificationbyid)
router.post("/updateCandidateIdealJob", candidateController.updateCandidateIdealJobbyid)
router.post("/getByIdCandidate", candidateController.getCandidatebyId)
router.post("/uploadCVFiles", uploadQuestionImage.single('cv_upload'), candidatedetailsController.saveimagevideo)
router.post("/uploadSkillFiles", uploadQuestionImage1.single('skill_assessment_upload'), candidatedetailsController.saveimagevideo)
router.post("/uploadReferenceFiles", uploadQuestionImage2.single('reference_upload'), candidatedetailsController.saveimagevideo)
router.post("/uploadVideoFiles", uploadQuestionImage3.single('video_upload'), candidatedetailsController.saveimagevideo)




// router.post("/uploadVideo", upload.single("file"),  async function (req, res) {
//   console.log(req.body);
//   if (!req.file) {
//     console.log("No file received");
//     return res.send({
//       success: false
//     });
//   } else { 
//     console.log('file: ',req.file);
//     return res.send({
//       success: true
//     })
//   }
// });


module.exports = router;