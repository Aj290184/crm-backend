import Employee from "../Models/employeeSchema.js";
import { success } from "../Utils/success.js";
import { customError } from "../Utils/customError.js";

export const getProfile = async (req, res) => {
  const userId = req.user.userId;

  const user = await Employee.findById(userId)
    .select("-password -otp");

  if (!user) {
    throw new customError("User not found", 404);
  }

  return success(res, 200, "Profile fetched successfully", user);
};

export const updateProfile = async (req, res) => {
  const userId = req.user.userId;

  const { name, phone, designation, department, experience, status
  } = req.body;

  const updateData = { name, phone, designation, department, 
   experience,  status,
  };

  //profile image
  if (req.file) {
    updateData.profileImage = req.file.path;
  }

  const user = await Employee.findByIdAndUpdate( userId, updateData,
    {
      new: true,
      runValidators: true,
    }).select("-password -otp");

  if (!user) {
    throw new customError("User not found", 404);
  }

  return success(res, 200, "Profile updated successfully", user);
};
