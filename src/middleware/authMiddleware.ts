import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Define the expected token payload structure
interface TokenPayload extends jwt.JwtPayload {
  id: string;
}

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) {
    res.status(401).json({ message: "Access Denied: No Token Provided" });
    return;
  }

  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
    if (decoded.id) {
      req.user = decoded; // Attach the decoded token to req.user
      next();
    } else {
      res.status(403).json({ message: "Invalid Token Payload" });
    }
  } catch (error) {
    res.status(403).json({ message: "Invalid Token" });
  }
};

export const authorizeCommander = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || typeof req.user !== "object" || req.user.isCommander !== true) {
    res.status(403).json({ message: "Access Denied: Not Authorized" });
    return
  }
  next();
};

export const authorizeTeemLeader = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || typeof req.user !== "object" || req.user.isCommander == true) {
    res.status(403).json({ message: "Access Denied: Not Authorized" });
    return
  }
  next();
};

