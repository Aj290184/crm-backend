import jwt from "jsonwebtoken";
import { customError } from "../Utils/customError.js";

export const authCheck = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new customError("Access token required", 401);
    }

    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : authHeader;

    if (!token) {
      throw new customError("Token missing", 401);
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY);
    req.user = decoded;

    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return next(new customError("Token expired", 401));
    }

    if (err instanceof customError) {
      return next(err);
    }

    return next(new customError("Invalid or missing token", 401));
  }
};