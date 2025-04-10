import { Request, Response, NextFunction, RequestHandler } from "express";
import jwt from "jsonwebtoken";

interface AuthRequest extends Request {
  user?: any;
}
export const authenticate: RequestHandler = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ error: "No token provided" });
    return;
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    res.status(401).json({ error: "Invalid token" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    //assigning the values of token to req
    req.user = decoded;
    next();
  } catch (err) {
    console.log(err, "inslide midlle ware");
    res.status(403).json({ error: "Invalid or expired token" });
  }
};
export const requireOrganizer = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  console.log(req.user.role);
  if (req.user.role !== "ORGANIZER") {
    res.status(403).json({ error: "Access denied: ORGANIZER only" });
    return;
  }
  next();
};
