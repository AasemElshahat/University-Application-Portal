import { DegreeCourseModel } from "./DegreeCourseModel";

interface IDegreeCourseData{
  name: string;
  shortName: string;
  universityName: string;
  universityShortName: string;
  departmentName: string;
  departmentShortName: string;
}

class DegreeCourseService{
  
  async getAllCourses() {
    try {
      return await DegreeCourseModel.find({})
    } catch (error) {
      console.error("error getting all the degree courses:", error)
      throw(error)
    }
  }

  async createCourse(requestData: IDegreeCourseData){
    try{
      const degreeCourse = await DegreeCourseModel.create(requestData)
      return degreeCourse
    }catch (error){
      console.error("Failed to create a new degree course:", error)
      throw(error)
    }
  }

  async getCourseByID(courseID: string) {
    try {
      const degreeCourse = await DegreeCourseModel.findById(courseID)
      return degreeCourse;
    } catch (error) {
      console.error("Error getting degree Course by name:", error)
      throw (error)
    }
  }

  async getCoursesByUniversity(shortName: string) {
    try {
      const courses = await DegreeCourseModel.find({ universityShortName: shortName });
      return courses;
    } catch (error) {
      console.error("Error getting courses by university:", error);
      throw(error);
    }
  }
  
  async updateCourse(courseID: string, requestData: Partial<IDegreeCourseData>) {
    try {
      const updatedDegreeCourse = await DegreeCourseModel.findByIdAndUpdate(courseID, requestData, {new:true});
      return updatedDegreeCourse;
    } catch (error) {
      console.error("Error updating degree course:", error)
      throw(error)
    }
  }

  async deleteCourse(courseID: string){
    try{
      const deletedDegreeCourse = await DegreeCourseModel.findByIdAndDelete(courseID)
      return deletedDegreeCourse

    } catch (error){
      console.error("Error deleting the degree course:", error)
      throw(error)
    }
  }
}

export default new DegreeCourseService();