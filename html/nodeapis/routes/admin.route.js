const express = require("express")
const router = express.Router()
const controllerAdmin = require("../controller/admin/adminControllers/adminController")
const controllerCandidate = require("../controller/admin/candidateControllers/candidateAdminController")
const controllerEmployer = require("../controller/admin/employerControllers/employerAdminController")

//------------------ For Video/Image Upload -------------
const upload = require('../config/multer.config.js');

//router.post("/uploadVideo", upload.single("file"), candidatedetailsController.uploadtabdata)

//----------- Route For Admin Side -------
router.post("/adminAdd", controllerAdmin.addAdmin)
router.post("/signinAdmin", controllerAdmin.adminSignIn)
router.post("/getCandidates", controllerCandidate.getCandidatedetails)
router.post("/getEmployers", controllerEmployer.getEmployerdetails)
router.post("/packagesAdd", controllerEmployer.addPackages)
router.get("/getsubscriptionPlans", controllerEmployer.getSubscriptionplans)
router.post("/getByIdPackage", controllerEmployer.getPakagebyId)  //singlepackage  or edit
router.post("/updatePackage", controllerEmployer.updatePackagebyid)   // update
router.post("/demo", controllerAdmin.democheck)
router.post("/candidateDetailsWithID", controllerCandidate.candidateDetailsWithID)
router.post("/getEmployerdetailsWithID", controllerEmployer.getEmployerdetailsWithID)
router.get("/getEmployerdetails", controllerEmployer.getEmployerdetails)
router.post("/getEmployerPackagedetailsWithID", controllerEmployer.getEmployerPackagedetailsWithID)
router.post("/activatePackagebyid", controllerEmployer.activatePackagebyid)
router.post("/getEmployerJobPostWithID", controllerEmployer.getEmployerJobPostWithID)
router.post("/getMatchedCandidate", controllerCandidate.getMatchedCandidate)

module.exports = router;