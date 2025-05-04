import { PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient();

class UserModel {
  static async createUser(
    name: string,
    email: string,
    password: string
  ): Promise<User> {
    return await prisma.user.create({
      data: {
        name,
        email,
        password,
      },
    });
  }

  static async findUserByEmail(email: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { email },
    });
  }

  static async findUserById(id: number): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { id },
    });
  }
}

export default UserModel;
