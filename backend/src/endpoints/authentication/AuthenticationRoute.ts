import { Router, Request, Response } from "express";
import { Buffer } from "buffer";
import AuthenticationService from "./AuthenticationService";
import UserService from "../user/UserService";

const authenticationRouter = Router();

authenticationRouter.get("/", async (req: Request, res: Response) => {
  const authHeader = req.header("Authorization");

  if (authHeader && authHeader.startsWith("Basic ")) {
    const credentialsBase64 = authHeader.split(" ")[1];

    if (!credentialsBase64) {
      return res.status(401).json({ Error: "Invalid credentials format" });
    }

    const decodedCredentials = Buffer.from(
      credentialsBase64,
      "base64"
    ).toString("utf-8");
    const parts = decodedCredentials.split(":");
    const userID = parts[0];
    const password = parts[1];

    if (!userID || !password) {
      return res.status(401).json({ Error: "Invalid credentials format" });
    }

    try {
      const token = await AuthenticationService.authenticate(userID, password);

      if (!token) {
        return res.status(401).json({ Error: "Authentication failed" });
      }

      const user = await UserService.getUserByID(userID);

      if (!user) {
        return res.status(404).json({ Error: "User not found" });
      }

      res.setHeader("Authorization", `Bearer ${token}`);
      return res.status(200).json({
        userID: user.userID,
        firstName: user.firstName,
        lastName: user.lastName,
        Success: "Token created successfully",
      });
    } catch (error) {
      return res
        .status(500)
        .json({ Error: "Internal Server Error during authentication" });
    }
  } else {
    return res
      .status(401)
      .json({ Error: "Authorization header is either missing or invalid" });
  }
});

export default authenticationRouter;
