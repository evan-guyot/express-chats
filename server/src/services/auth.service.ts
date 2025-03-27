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

  static async getTokenInfos(token: string | undefined): Promise<{ id: number; email: string; [key: string]: unknown } | undefined> {
    if(!token){
      return undefined;
    }

    try {
      const secretKey = process.env.JWT_SECRET || "7b5ff7fdbc4fddcc5db20cc804f7da03682d9a914b8501d3e2889d97f0d4f84c67a3558e7359809c2b17bb9d60b2e47b10531f8d74ad1f898a64fdadd6e96e48304aa763f3bf9802a2cbd4f339af810079d4d9091cb780e240262982cb4af37a24300471cce7763a0b20660ed808d5059c58ea10635a23c4cffc893aa6e6d54a1db42f3ac5de84ec694a7ee400ba851d88d66718add59d7cbc0a0ec4641b5b9a6bc4c3705b012a18936bb089e81345a2c67fa56349f2a6a99d1b0065f565df9d89ca522c416b8e8be3a62a5ce93665056a3a9bfe54ce7fa37992417831e6dce34ed8e26d72743a7c9010bfe7eefde43e8475bf5ec73e9baee241db186af0b880";
      const decoded = jwt.verify(token, secretKey);
      return decoded as { id: number; email: string; [key: string]: unknown };
    } catch (error) {
      console.error("Invalid token:", error);
      return undefined;
    }
  }
}

export default AuthService;
