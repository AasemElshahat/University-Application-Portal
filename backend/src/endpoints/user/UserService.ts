import { UserModel } from "./UserModel";

export interface IUserData{
  userID: string; 
  password: string;
  firstName?: string;
  lastName?: string;
  isAdministrator?: boolean;
}

class UserService{
  async getAllUsers() {
    try{
      return await UserModel.find({});
    } catch (error){
      console.error("Error getting all the users:", error)
      throw(error)
    }
  }

  async createUser(userRequestData:IUserData){
    try{
      const user = await UserModel.create(userRequestData)
      return user
    }catch (error){
      console.error("Failed creating a new use:", error)
      throw(error)
    }
  }
  
  async getUserByID(userID: string){
    try{
      const user = await UserModel.findOne({userID: userID});
      return user;
    }catch(error){
      console.error("Error getting a user by ID:", error)
      throw(error)
    }
  }

  async updateUser(userID: string, userRequestData:Partial<IUserData>){
    try{
      const updatedUser = await UserModel.findOneAndUpdate({userID: userID}, userRequestData, {new: true})
      return updatedUser
    }catch (error){
      console.error("Error updating user", error)
      throw(error)
    }
  }

  async deleteUser(userID: string){
    try{
      const deletedUser = await UserModel.findOneAndDelete({userID: userID})
      return deletedUser
    } catch (error){
      console.error("Error deleting the user:", error)
      throw(error)
    }
  }
}

export default new UserService();