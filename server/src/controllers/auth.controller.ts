import { Request, Response } from "express";
import AuthService from "../services/auth.service";
import { loginAuthSchema, registerAuthSchema } from "../schemas/auth.schema";
import { z } from "zod";

class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const validatedData = registerAuthSchema.parse(req.body);

      const user = await AuthService.register(
        validatedData.name,
        validatedData.email,
        validatedData.password
      );
      res.status(201).json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res
          .status(400)
          .json({ error: "Wrong data format sent", details: error.errors });
        return;
      }

      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const validatedData = loginAuthSchema.parse(req.body);

      const user = await AuthService.login(
        validatedData.email,
        validatedData.password
      );

      if (!user) {
        res.status(401).json({ error: "Invalid credentials" });
        return;
      }

      res.json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res
          .status(400)
          .json({ error: "Wrong data format sent", details: error.errors });
        return;
      }

      console.log(error);

      res.status(500).json({ error: "Internal server error" });
    }
  }
}

export default AuthController;
