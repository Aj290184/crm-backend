import Employee from "../Models/employeeSchema.js";
import Course from "../Models/courseSchema.js";
import Placement from "../Models/placementSchema.js";
import Resume from "../Models/resumeSchema.js";
import Student from "../Models/studentSchema.js";
import Alumni from "../Models/alumniSchema.js";
import bcrypt from "bcrypt";
import { customError } from "../Utils/customError.js";
import { success } from "../Utils/success.js";


//create user
const createUserController = async (req, res) => {
  const { name, email, phone, password, role, experience } = req.body;

  if (!name || !email || !phone || !password || !role || !experience) {
    throw new customError("All required fields must be filled", 400);
  }

  const validRoles = Employee.schema.path("role").enumValues;
  if (!validRoles.includes(role)) {
    throw new customError("Invalid role", 400);
  }

  const existingUser = await Employee.findOne({ email });
  if (existingUser) {
    throw new customError("User already exists", 409);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await Employee.create({name, email, phone,
    password: hashedPassword, role,
    experience: Number(experience),
    profileImage: req.file ? req.file.path : null,
  });

  const userObj = user.toObject();
  delete userObj.password;
  
  return success(res, 201, "User created successfully", userObj);
};

//create course
const createCourse = async (req, res) => {
  const { courseName, description, duration, fee } = req.body;

  if (!courseName || !duration || !fee) {
    throw new customError("Required fields are missing", 400);
  }

  const existingCourse = await Course.findOne({ courseName });
  if (existingCourse) {
    throw new customError("Course already exists", 409);
  }

  const course = await Course.create({ courseName, description,
    duration, fee,
    courseImg: req.file ? req.file.path : null,
  });

  return success(res, 201, "Course created successfully", course);
};

//create student
const createStudentController = async (req, res) => {
  const { name, gender, age, qualification, email,
    phone, address, course, batch,
  } = req.body;

  if (!name || !gender || !age || !qualification || !email ||
    !phone || !address || !course || !batch
  ) {
    throw new customError("All fields are required", 400);
  }

  const existingStudent = await Student.findOne({ email });
  if (existingStudent) {
    throw new customError("Student already exists", 409);
  }

  const student = await Student.create({ name, gender, age,
    qualification, email, phone, address,
    course, batch,
    profileImage: req.file ? req.file.path : null,
    createdBy: req.user.userId,
  });

  return success(res, 201, "Student created successfully", student);
};

//create resume
const createResumeController = async (req, res) => {
  const { student, name, email, phone, course, status } = req.body;

  if (!student || !name || !email || !phone || !course) {
    throw new customError("All fields are required", 400);
  }

  const studentExists = await Student.findById(student);
  if (!studentExists) {
    throw new customError("Student not found", 404);
  }

  const existingResume = await Resume.findOne({ student });
  if (existingResume) {
    throw new customError("Resume already exists for this student", 409);
  }

  const resume = await Resume.create({ student, name,  email,
    phone, course,
    resumeUrl: req.file ? req.file.path : null,
    status, createdBy: req.user.userId,
  });

  return success(res, 201, "Resume created successfully", resume);
};

//create placement
const createPlacement = async (req, res) => {
  const { student, companyName, jobRole, package: packageAmount,
    location, status, joiningDate,
  } = req.body;

  if (!student || !companyName || !jobRole || !packageAmount || !location) {
    throw new customError("All required fields are missing", 400);
  }

  const studentExists = await Student.findById(student);
  if (!studentExists) {
    throw new customError("Student not found", 404);
  }

  const placement = await Placement.create({ student, companyName,
    jobRole, package: packageAmount, location,
    status, joiningDate,
    createdBy: req.user.userId,
  });

  return success(res, 201, "Placement created successfully", placement);
};

//create alumni
const createAlumni = async (req, res) => {
  const { student, passingYear, companyName, jobRole, location } = req.body;

  if (!student || !passingYear || !companyName || !jobRole || !location) {
    throw new customError("All fields are required", 400);
  }

  const studentExists = await Student.findById(student);
  if (!studentExists) {
    throw new customError("Student not found", 404);
  }

  const alreadyAlumni = await Alumni.findOne({ student });
  if (alreadyAlumni) {
    throw new customError("Student already exists in alumni", 409);
  }

  const alumni = await Alumni.create({ student, passingYear,
    companyName, jobRole, location,
    profileImage: req.file ? req.file.path : null,
    createdBy: req.user.userId,
  });

  return success(res, 201, "Alumni created successfully", alumni);
};

export { createUserController, createCourse,
  createStudentController, createResumeController,
  createPlacement, createAlumni,
};