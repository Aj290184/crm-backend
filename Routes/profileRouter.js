import { Router } from "express";
import { getProfile, updateProfile } from "../Cantrollers/profileController.js";
import { authCheck } from "../Middleware/authCheckMiddleware.js";
import { asyncHandler } from "../Utils/asyncHandler.js";
import upload from "../Utils/upload.js";

const profileRouter = Router();

profileRouter.get(
  "/profile",
  authCheck,
  asyncHandler(getProfile)
);

profileRouter.put(
  "/profile",
  authCheck,
  upload.single("profileImage"),
  asyncHandler(updateProfile)
);

export default profileRouter;
