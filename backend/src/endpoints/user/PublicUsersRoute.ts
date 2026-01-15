import { Router } from "express";
import UserService from "./UserService";

const publicUserRouter = Router();

publicUserRouter.get("/", async (req, res) => {
  try{
    const users = await UserService.getAllUsers();
    res.json(users);
  } catch (error){
    res.status(500).json({Error: "Error getting all the users"})
  }
})


publicUserRouter.post("/", async (req, res) => {
  try{
    const newUser = await UserService.createUser(req.body);
    res.status(201).json(newUser)
  }catch (error){
    console.error("Error creating the user", error)
    res.status(400).json({Error: "Error while creating the user"})
  }
})

publicUserRouter.get("/:userID", async (req, res) => {
  try{
    const user = await UserService.getUserByID(req.params.userID)

    if(!user){
      return res.status(404).json({Error: "user not found"})
    }
    res.json(user)
  } catch (error){
    console.error("Error getting the user by ID:", error)
    res.status(500).json({Error: "Error getting the user"})
  }
})

publicUserRouter.put("/:userID", async (req, res) => {
  try{
    const updatedUser = await UserService.updateUser(req.params.userID, req.body)
    
    if (!updatedUser){
      return res.status(404).json({Error: "couldn't find a user to update"})
    }
    return res.status(200).json(updatedUser)
  } catch (error){
    console.error("Error updating the user:", error)
    res.status(500).json({Error: "Error updating the user"})
  }
})

publicUserRouter.delete("/:userID", async (req, res) => {
  try{
    const deletedUser = await UserService.deleteUser(req.params.userID)

    if (!deletedUser){
      return res.status(404).json({Error: "couldn't find a user to delete"})
    }
    return res.status(204).send()
  } catch (error){
    console.error("Error deleting the user:", error)
    res.status(500).json({Error: "Error deleting the user"})
  }
})

export default publicUserRouter;