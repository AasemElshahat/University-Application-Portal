import UserService from "../user/UserService";
import * as bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import { config } from "../../config/config";

class AuthenticationService {
    async authenticate(userID: string, password: string): Promise<string | null> {
        try {
            const user = await UserService.getUserByID(userID);
            if (!user) {
                return null; 
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return null;
            }

            const tokenPayload = {
                userID: user.userID,
                isAdministrator: user.isAdministrator,
            };

            const secretKey = config.jwtSecret;

            const token = jwt.sign(tokenPayload, secretKey, { expiresIn: '1h' });

            return token;

        } catch (error) {
            console.error("Authentication Logic Error:", error);
            throw error;
        }
    }
}

export default new AuthenticationService();