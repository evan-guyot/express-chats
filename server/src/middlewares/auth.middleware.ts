import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export interface AuthenticatedRequest extends Request {
  token: string | JwtPayload;
}

const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    res.status(401).json({ error: "Access denied. No token provided." });
    return;
  }

  jwt.verify(token, process.env.JWT_SECRET!, (err, decoded) => {
    if (err || !decoded) {
      res.status(403).json({ error: "Invalid or expired token." });
      return;
    }

    (req as AuthenticatedRequest).token = decoded;
    next();
  });
};

export default authenticateToken;
