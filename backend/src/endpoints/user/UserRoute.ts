import { Router } from "express";
import UserService, {IUserData} from "./UserService";
import { authenticateToken } from "../../utils/AuthenticationMiddleware";

const userRouter = Router();

userRouter.get("/", authenticateToken, async (req, res) => {
  if (!req.user?.isAdministrator){
    return res.status(403).json({Error: "Forbidden: Admins only!"})
  }

  try{
    const users = await UserService.getAllUsers();
    
    const usersWithoutPassword = users.map(user => {
      const userObject = user.toJSON() as any;
      delete userObject.password;
      return userObject
    })
    return res.status(200).json(usersWithoutPassword);
  } catch (error){
    res.status(500).json({Error: "Error getting all the users"})
  }
})

userRouter.post("/", authenticateToken ,async (req, res) => {
  if (!req.user) {
    return res.status(500).json({ Error: "Error: User data not found after authentication" });
  }
  
  if (!req.user?.isAdministrator){
    return res.status(403).json({Error: "Forbidden: Admins only!"})
  }

  const existingUser = await UserService.getUserByID(req.body.userID)

  if (existingUser){
    return res.status(400).json({Error: "User Already Exists in the system, cannot create it again!"})
  }
  
  try{
    const newUser = await UserService.createUser(req.body);

    const newUserWithoutPassword = newUser.toJSON() as any
    delete newUserWithoutPassword.password

    res.status(201).json(newUserWithoutPassword)
  }catch (error){
    console.error("Error creating the user", error)
    res.status(400).json({Error: "Error while creating the user"})
  }
})

userRouter.get("/:userID", authenticateToken ,async (req, res) => {
  if (!req.user) {
    return res.status(500).json({ Error: "Error: User data not found after authentication" });
  }

  if (!req.user?.isAdministrator && req.user.userID !== req.params.userID) {
    return res.status(403).json({ Error: "Forbidden: You can only access your own data" });
  }

  try{
    if (!req.params.userID){
      return res.status(400).json({Error: "User ID is missing!"})
    }

    const user = await UserService.getUserByID(req.params.userID)

    if(!user){
      return res.status(404).json({Error: "user not found"})
    }

    const userWithoutPassword = user.toJSON() as any
    delete userWithoutPassword.password

    res.json(userWithoutPassword)

  } catch (error){
    console.error("Error getting the user by ID:", error)
    res.status(500).json({Error: "Error getting the user"})
  }
})

userRouter.put("/:userID", authenticateToken ,async (req, res) => {
  if (!req.user) {
    return res.status(500).json({ Error: "Error: User data not found after authentication" });
  }
  
  if (!req.user?.isAdministrator && req.user?.userID !== req.params.userID){
    return res.status(403).json({Error: "Forbidden: you don't have access to do this operation"})
  }
  
  if (!req.params.userID){
    return res.status(400).json({Error: "User ID is missing!"})
  }

  try{

    let updateData: Partial<IUserData>

    if (req.user.isAdministrator) {
      updateData = { ...req.body }
    } else {
      updateData = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
      }
    }

    // Only include password if it's provided and non-empty (safety net)
    if (req.body.password && req.body.password.trim() !== '') {
      updateData.password = req.body.password;
    } else {
      delete updateData.password;
    }
    
    const updatedUser = await UserService.updateUser(req.params.userID, updateData)
    
    if (!updatedUser){
      return res.status(404).json({Error: "couldn't find a user to update"})
    }

    const updatedUserWithoutPassword = updatedUser.toJSON() as any
    delete updatedUserWithoutPassword.password

    return res.status(200).json(updatedUserWithoutPassword)
  } catch (error){
    console.error("Error updating the user:", error)
    res.status(500).json({Error: "Error updating the user"})
  }
})

userRouter.delete("/:userID", authenticateToken ,async (req, res) => {
  if (!req.user) {
    return res.status(500).json({ Error: "Error: User data not found after authentication" });
  }

  if (!req.user?.isAdministrator){
    return res.status(403).json({Error: "Forbidden: Admins only!"})
  }

  try{
    if (!req.params.userID){
      return res.status(400).json({Error: "User ID is missing!"})
    }

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

export default userRouter;