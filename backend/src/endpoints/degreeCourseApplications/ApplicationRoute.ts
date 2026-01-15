import { Router } from "express";
import ApplicationService from "./ApplicationService";
import { authenticateToken } from "../../utils/AuthenticationMiddleware";
import { IDegreeCourseApplication } from "./ApplicationService";
import { FilterQuery } from "mongoose";

const applicationRouter = Router();

applicationRouter.post("/", authenticateToken, async(req, res) => {
  try{

    if (!req.user?.userID){
      return res.status(400).json({Error: "userID is missing!"})
    }

    let targetUserID = req.user.userID;

    if (req.user.isAdministrator && req.body.applicantUserID) {
      targetUserID = req.body.applicantUserID
    }

    const applicationData = {
      applicantUserID: targetUserID,
      degreeCourseID: req.body.degreeCourseID,
      targetPeriodYear: req.body.targetPeriodYear,
      targetPeriodShortName: req.body.targetPeriodShortName,
    }

    const newApplication = await ApplicationService.createApplication(applicationData)
    res.status(201).json(newApplication)
  } catch (error){
    console.error(error)
    res.status(400).json({Error: "Error while creating the Application"})
  }
})

applicationRouter.get("/myApplications", authenticateToken, async(req, res) => {
  try{
    if (!req.user?.userID){
      return res.status(400).json({Error: "userID is missing!"})
    }

    const applications = await ApplicationService.getApplications({applicantUserID: req.user.userID})
    res.status(200).json(applications)
    
  } catch (error){
    console.error(error)
    res.status(400).json({Error: "Error getting the user applications!"})
  }
})

applicationRouter.get("/", authenticateToken, async(req, res) => {
  try{
    if (!req.user?.userID){
      return res.status(400).json({Error: "userID is missing!"})
    }

    if (!req.user.isAdministrator){
      return res.status(403).json({Error: "Forbidden: Admins only!"})
    }

    const filter: FilterQuery<IDegreeCourseApplication> = {}

    if (req.query.applicantUserID) {
      filter.applicantUserID = req.query.applicantUserID as string
    }
    
    if (req.query.degreeCourseID) {
      filter.degreeCourseID = req.query.degreeCourseID as string
    }

    const adminApplications = await ApplicationService.getApplications(filter)
    return res.status(200).json(adminApplications)
  } catch (error){
    res.status(400).json({Error: "Error getting applications!"})
  }
})

applicationRouter.put("/:id", authenticateToken, async(req, res) => {

  if (!req.params.id){
    return res.status(400).json({Error: "Application ID is missing!"})
  }

  try{
    const fetchedApplication = await ApplicationService.getApplicationByID(req.params.id)
  
    if (!fetchedApplication){
      return res.status(404).json({Error: "Application Not found!"})
    }
  
    if (!req.user?.isAdministrator && (req.user?.userID !== fetchedApplication.applicantUserID)){
      return res.status(403).json({Error: "Forbidden: no access, cannot do this operation!"})
    }
  
    let updateApplicationData: Partial<IDegreeCourseApplication>
  
    if (req.user?.isAdministrator){
      updateApplicationData = req.body
    } else {
      updateApplicationData = {
        targetPeriodYear: req.body.targetPeriodYear,
        targetPeriodShortName: req.body.targetPeriodShortName
      }
    }
    const updatedApplication = await ApplicationService.updateApplication(req.params.id, updateApplicationData)
    return res.status(200).json(updatedApplication)
  } catch (error){
    res.status(500).json({Error: "Error updating application"})
  }
})

applicationRouter.delete("/:id", authenticateToken, async(req, res) => {
  if (!req.params.id) {
    return res.status(400).json({Error: "Application ID is missing!"})
  }

  try{
    const applicationToDelete = await ApplicationService.getApplicationByID(req.params.id)
    
    if (!applicationToDelete) {
      return res.status(404).json({Error: "Application not found, no application to delete!"})
    }

    if (!req.user?.isAdministrator && (req.user?.userID !== applicationToDelete.applicantUserID)){
      return res.status(403).json({Error: "Forbidden: no access, cannot perform this action!"})
    }

    await ApplicationService.deleteApplication(req.params.id)

    return res.status(204).send()

  } catch (error){
    res.status(500).json({Error: "Error deleting application"})
  }
})

export default applicationRouter