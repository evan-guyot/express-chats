import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import UserModel from "../models/user.model";
import { User } from "@prisma/client";

interface UserWithToken extends User {
  token: string;
  tokenExpiration: Date;
}

class AuthService {
  static async register(
    name: string,
    email: string,
    password: string
  ): Promise<UserWithToken | undefined> {
    const existingUser = await UserModel.findUserByEmail(email);

    if (existingUser) {
      throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await UserModel.createUser(name, email, hashedPassword);

    const expireTimeInHours = 8;
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn : `${expireTimeInHours}h` }
    );

    const tokenExpiration = new Date();
    tokenExpiration.setHours(tokenExpiration.getHours() + expireTimeInHours);


    return { ...user, token, tokenExpiration, password: "hidden" };
  }

  static async login(
    email: string,
    password: string
  ): Promise<UserWithToken | undefined> {
    const user = await UserModel.findUserByEmail(email);

    if (!user) {
      return undefined;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return undefined;
    }

    const expireTimeInHours = 8;
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn : `${expireTimeInHours}h` }
    );

    const tokenExpiration = new Date();
    tokenExpiration.setHours(tokenExpiration.getHours() + expireTimeInHours);

    return { ...user, token, tokenExpiration, password: "hidden" };
  }
}

export default AuthService;
