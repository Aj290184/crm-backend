import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import Employee from "../Models/employeeSchema.js";
import { otpTemplate } from "../Templates/otpTemplate.js";
import { sendEmail } from "../Services/emailService.js";
import { customError } from "../Utils/customError.js";
import { success } from "../Utils/success.js";
import { generateAccessToken, generateRefreshToken } from "../Utils/tokens.js";


//login with email and password
export const authLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new customError("Email and password are required", 400);
  }

  const user = await Employee.findOne({ email }).select("+password");

  if (!user) {
    throw new customError("User not found", 404);
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new customError("Invalid credentials", 400);
  }

  //If not verified → send OTP
  if (!user.isVerified) {
    const otp = Math.floor(10000 + Math.random() * 90000);
    const emailHtml = otpTemplate.replace("{OTP}", otp.toString());
    await sendEmail(user.email, "OTP Verification", emailHtml);

    user.otp = otp;
    await user.save();

    return success(res, 200, "OTP sent successfully", {
      email: user.email,
      isVarified: false,
      otpRequired: true,
    });
  }

  const accessToken = generateAccessToken({
    userId: user._id,
    role: user.role,
  });

  const refreshToken = generateRefreshToken({
    userId: user._id,
    role: user.role,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  const userObj = user.toObject();
  delete userObj.password;
  delete userObj.otp;

  return success(res, 200, "Login successful", {
    token: accessToken,
    user: userObj,
    isVarified: true,
  });
};


//otp verify for login
export const authOtp = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    throw new customError("Email and OTP are required", 400);
  }

  const user = await Employee.findOne({ email }).select("+otp");;

  if (!user) {
    throw new customError("User not found", 404);
  }

  if (user.otp !== Number(otp)) {
    throw new customError("Invalid OTP", 400);
  }

  user.otp = null;
  user.isVerified = true;

  await user.save();

  const accessToken = generateAccessToken({
    userId: user._id,
    role: user.role,
  });

  const refreshToken = generateRefreshToken({
    userId: user._id,
    role: user.role,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  const userObj = user.toObject();
  delete userObj.password;
  delete userObj.otp;

  return success(res, 200, "OTP verified successfully", {
    token: accessToken,
    user: userObj,
    isVarified: true,
  });
};


//generate new access token using refresh token
export const refreshAccessToken = async (req, res) => {
  const { refreshToken } = req.cookies || {};

  if (!refreshToken) {
    throw new customError("Refresh token not found", 401);
  }

  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET_KEY
    );

    const newAccessToken = generateAccessToken({
      userId: decoded.userId,
      role: decoded.role,
    });

    return success(res, 200, "Access token refreshed", {
      token: newAccessToken,
    });

  } catch (err) {
    //If refresh expired → force re-verification
    try {
      const decoded = jwt.decode(refreshToken);
      if (decoded?.userId) {
        const user = await Employee.findById(decoded.userId);

        if (user) {
          user.isVerified = false;
          const otp = Math.floor(10000 + Math.random() * 90000);
          user.otp = otp;

          await user.save();
          const emailHtml = otpTemplate.replace("{OTP}", otp.toString());
          await sendEmail(user.email, "Session Expired - OTP Verification", emailHtml);
        }
      }
    } catch (err) {}

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    throw new customError("Session expired. OTP sent to email.", 401);
  }
};


//get user data
export const getUserData = async (req, res) => {
  const user = await Employee.findById(req.user.userId);

  if (!user) {
    throw new customError("User not found", 404);
  }

  const userObj = user.toObject();
  delete userObj.password;
  delete userObj.otp;

  return success(res, 200, "User data fetched", userObj);
};


//update user password
export const updatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    throw new customError("Old password and new password are required", 400);
  }

  const user = await Employee.findById(req.user.userId).select("+password");

  if (!user) {
    throw new customError("User not found", 404);
  }

  const isMatch = await bcrypt.compare(currentPassword, user.password);

  if (!isMatch) {
    throw new customError("Old password is incorrect", 400);
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  user.password = hashedPassword;

  await user.save();

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  return success(res, 200, "Password updated successfully. Please login again.");
};


//user forgot password - send reset link to email
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new customError("Email is required", 400);
  }

  const user = await Employee.findOne({ email });

  if (!user) {
    throw new customError("User not found", 404);
  }

  // generate reset token
  const resetToken = crypto.randomBytes(32).toString("hex");

  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  await user.save();

  const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  await sendEmail(
    user.email,
    "Reset Password",
    `
      <p>You requested a password reset.</p>
      <p>Click the link below:</p>
      <a href="${resetURL}">${resetURL}</a>
      <p>This link will expire in 15 minutes.</p>
    `
  );

  return success(res, 200, "Reset password link sent to email");
};


//reset password using token
export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  if (!newPassword) {
    throw new customError("New password is required", 400);
  }

  const hashedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await Employee.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    throw new customError("Invalid or expired reset token", 400);
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  user.password = hashedPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  return success(res, 200, "Password reset successful. Please login.");
};

//Auth logout - clear refresh token cookie
export const authLogout = async (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  return success(res, 200, "Logout successful");
};