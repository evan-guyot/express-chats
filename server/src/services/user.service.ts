import { User } from "@prisma/client";
import UserModel from "../models/user.model";

class UserService {
  static async getUserById(id: number): Promise<User | null> {
    return UserModel.findUserById(id);
  }
}

export default UserService;
