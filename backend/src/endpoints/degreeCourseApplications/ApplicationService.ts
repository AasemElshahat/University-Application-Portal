import { FilterQuery } from "mongoose";
import { ApplicationModel } from "./ApplicationModel";
import { DegreeCourseModel } from "../degreeCourses/DegreeCourseModel";

export interface IDegreeCourseApplication {
  applicantUserID: string,
  degreeCourseID: string,
  targetPeriodYear: number,
  targetPeriodShortName: string,
}

class ApplicationService{
  async createApplication(requestData: IDegreeCourseApplication) {
    try{

      let course = null;
      try {
        course = await DegreeCourseModel.findById(requestData.degreeCourseID);
      } catch (e) {
        throw new Error("Invalid Degree Course ID format");
      }

      if (!course) {
        throw new Error(`Degree Course with ID ${requestData.degreeCourseID} does not exist!`);
      }

      const existingApplication = await ApplicationModel.findOne({
        ...requestData
      })
      if (existingApplication) {
        throw new Error("Application already exists for this user in this semester!")
      }

      const degreeCourseApplication = await ApplicationModel.create(requestData)
      return degreeCourseApplication

    } catch (error){
      console.log("Error creating a new degree course application", error)
      throw error
    }
  }

  async getApplications(filter: FilterQuery<IDegreeCourseApplication>){
    try{
      const applications = await ApplicationModel.find(filter);

      // Populate degree course information for each application
      const populatedApplications = await Promise.all(
        applications.map(async (app) => {
          const appObj = app.toJSON();

          // Fetch the degree course details
          const degreeCourse = await DegreeCourseModel.findById(app.degreeCourseID);

          if (degreeCourse) {
            return {
              ...appObj,
              degreeCourseName: degreeCourse.name,
              degreeCourseShortName: degreeCourse.shortName,
              universityName: degreeCourse.universityShortName,
              departmentName: degreeCourse.departmentShortName
            };
          }

          return appObj;
        })
      );

      return populatedApplications;
    } catch(error) {
      console.error("Error getting applications:", error)
      throw error
    }
  }

  async getApplicationByID(applicationID: string){
    try{
      const application = await ApplicationModel.findById(applicationID)
      return application
    } catch (error){
      return null
    }
  }

  async updateApplication(applicationID: string, updatedData: Partial<IDegreeCourseApplication>){
    try{
      const updatedApplication = await ApplicationModel.findByIdAndUpdate(applicationID, updatedData, {new: true})
      return updatedApplication
    } catch (error){
      throw error
    }
  }

  async deleteApplication(applicationID: string){
    try{
      const deletedApplication = await ApplicationModel.findByIdAndDelete(applicationID)
      return deletedApplication
    } catch (error){
      throw error
    }
  }
}

export default new ApplicationService();