import { Router } from "express";
import {
  authLogin,
  authOtp,
  refreshAccessToken,
  getUserData,
  authLogout,
  updatePassword,
  forgotPassword,
  resetPassword,
} from "../Cantrollers/authController.js";

import { asyncHandler } from "../Utils/asyncHandler.js";
import { authorizedRoles } from "../Middleware/authorizedRoles.js";
import { authCheck } from "../Middleware/authCheckMiddleware.js";

const authRouter = Router();

//auth routes
authRouter.post("/login", asyncHandler(authLogin));
authRouter.post("/verify-otp", asyncHandler(authOtp));
authRouter.post("/refresh-token", asyncHandler(refreshAccessToken));
authRouter.post("/logout", authCheck, asyncHandler(authLogout));

//forgot and reset password routes
authRouter.post("/forgot-password", asyncHandler(forgotPassword));
authRouter.post("/reset-password/:token", asyncHandler(resetPassword));

//get user data route
authRouter.get(
  "/me",
  authCheck,
  authorizedRoles("admin", "counseller", "hr"),
  asyncHandler(getUserData)
);

//update password route
authRouter.put(
  "/update-password",
  authCheck,
  asyncHandler(updatePassword)
);

export default authRouter;