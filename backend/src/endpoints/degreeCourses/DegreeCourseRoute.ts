import { Router } from "express";
import DegreeCourseService from "./DegreeCourseService";
import { authenticateToken } from "../../utils/AuthenticationMiddleware";
import ApplicationService from "../degreeCourseApplications/ApplicationService";

const degreeCourseRouter = Router();

degreeCourseRouter.get("/", async(req, res) => {
  const uniShortName = req.query.universityShortName as string | undefined;

  try{
    if (uniShortName){
      const uniCourses = await DegreeCourseService.getCoursesByUniversity(uniShortName)
      return res.status(200).json(uniCourses)
    } else {
      const courses = await DegreeCourseService.getAllCourses();
      return res.status(200).json(courses)
    }
  } catch (error) {
    res.status(500).json({Error: "Error getting degree courses"})
  }
})

degreeCourseRouter.post("/", authenticateToken, async(req, res) => {
  if (!req.user?.isAdministrator){
    return res.status(403).json({Error: "Forbidden: Admins only!"})
  }

  try{
    const newCourse = await DegreeCourseService.createCourse(req.body)
    return res.status(201).json(newCourse)
  } catch (error) {
    res.status(400).json({Error: "Error creating degree course"})
  }
})


degreeCourseRouter.get("/:id/degreeCourseApplications", authenticateToken, async(req, res) => {
  if (!req.params.id){
    return res.status(400).json({Error: "Degree Course ID is missing!"})
  }
  if (!req.user?.isAdministrator){
    return res.status(403).json({Error: "Forbidden: Admins only!"})
  }

  try{
    const courseApplications = await ApplicationService.getApplications({degreeCourseID: req.params.id})
    return res.status(200).json(courseApplications)
  } catch (error){
    res.status(500).json({Error: "Error getting the Degree Course Applications"})
  }
})

degreeCourseRouter.get("/:id", async(req, res) => {
  try{
    const course = await DegreeCourseService.getCourseByID(req.params.id)
    if (!course){
      return res.status(404).json({Error: "Course Not Found!"})
    }
    return res.status(200).json(course)
  } catch (error) {
    res.status(500).json({Error: "Errror finding degree course by ID"})
  }
})

degreeCourseRouter.put("/:id", authenticateToken, async(req, res)=> {
  if (!req.user?.isAdministrator){
    return res.status(403).json({Error: "Forbidden: Admins only!"})
  }

  if (!req.params.id){
    return res.status(400).json({Error: "Course ID is missing!"})
  }

  try{
    const updatedCourse = await DegreeCourseService.updateCourse(req.params.id, req.body)

        if (!updatedCourse){
      return res.status(404).json({Error: "Course not found to update!"})
    }

    return res.status(200).json(updatedCourse)
  } catch (error) {
    res.status(400).json({Error: "Error updating degree course"})
  }
})

degreeCourseRouter.delete("/:id", authenticateToken, async(req, res) => {
  if (!req.user?.isAdministrator){
    return res.status(403).json({Error: "Forbidden: Admins only!"})
  }

  if (!req.params.id){
    return res.status(400).json({Error: "Course ID is missing!"})
  }
  try{
    const deletedCourse = await DegreeCourseService.deleteCourse(req.params.id)

    if (!deletedCourse){
      return res.status(404).json({Error: "Course not found to delete!"})
    }

    return res.status(204).send()
  } catch (error){
    res.status(500).json({Error: "Error deleting degree course"})
  }
})

export default degreeCourseRouter;