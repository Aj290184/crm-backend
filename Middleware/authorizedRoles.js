import { customError } from "../Utils/customError.js";

export const authorizedRoles = (...roles) => (req, res, next) => {
  const userRole = String(req.user?.role || "").toLowerCase();

  if (!userRole) {
    return next(new customError("Unauthorized: No role found", 401));
  }

  const allowed = roles.map((r) => String(r).toLowerCase());

  if (!allowed.includes(userRole)) {
    return next(new customError("Forbidden: You don't have permission", 403));
  }

  return next();
};
