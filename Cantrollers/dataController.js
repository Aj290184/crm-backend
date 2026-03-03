import Course from "../Models/courseSchema.js";
import Student from "../Models/studentSchema.js";
import Resume from "../Models/resumeSchema.js";
import Placement from "../Models/placementSchema.js";
import Alumni from "../Models/alumniSchema.js";
import Employee from "../Models/employeeSchema.js";

import { success } from "../Utils/success.js";
import { customError } from "../Utils/customError.js";

//get aa courses
const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .sort({ courseName: 1 })
      .limit(9);

    return success(res, 200, "Courses fetched successfully", courses);
  } catch (error) {
    throw new customError("Failed to fetch courses", 500);
  }
};

//for view the course
const getCourseById = async (req, res) => {
  const { id } = req.params;

  const course = await Course.findById(id);
  if (!course) {
    throw new customError("Course not found", 404);
  }

  return success(res, 200, "Course fetched successfully", course);
};

//for update the course
const updateCourse = async (req, res) => {
  const { id } = req.params;

  const updatedCourse = await Course.findByIdAndUpdate(
    id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!updatedCourse) {
    throw new customError("Course not found", 404);
  }

  return success(res, 200, "Course updated successfully", updatedCourse);
};

//for delete the course
const deleteCourse = async (req, res) => {
  const { id } = req.params;

  const course = await Course.findByIdAndDelete(id);
  if (!course) {
    throw new customError("Course not found", 404);
  }

  return success(res, 200, "Course deleted successfully", course);
};

//get all students
const getAllStudents = async (req, res) => {
  const students = await Student.find()
    .sort({ name: 1 })
    .limit(9);

  return success(res, 200, "Students fetched successfully", students);
};

//get only one student by id
const getStudentById = async (req, res) => {
  const { id } = req.params;

  const student = await Student.findById(id);
  if (!student) {
    throw new customError("Student not found", 404);
  }

  return success(res, 200, "Student fetched successfully", student);
};

//for update the student
const updateStudent = async (req, res) => {
  const { id } = req.params;

  const updatedStudent = await Student.findByIdAndUpdate(
    id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!updatedStudent) {
    throw new customError("Student not found", 404);
  }

  return success(res, 200, "Student updated successfully", updatedStudent);
};

//delete student
const deleteStudent = async (req, res) => {
  const { id } = req.params;

  const student = await Student.findById(id);

  if (!student) {
    throw new customError("Student not found", 404);
  }

  await Student.findByIdAndDelete(id);
  return success( res, 200, "Student deleted successfully", { id });
};


//get all employee
const getAllEmployees = async (req, res) => {
  const employees = await Employee.find()
    .select("-password -otp")
    .sort({ createdAt: -1 });

  return success(res, 200, "Employees fetched successfully", employees);
};

//get only one employee
const getEmployeeById = async (req, res) => {
  const { id } = req.params;

  const employee = await Employee.findById(id)
    .select("-password -otp");

  if (!employee) {
    throw new customError("Employee not found", 404);
  }

  return success(res, 200, "Employee fetched successfully", employee);
};

//get all resumes
const getAllResumes = async (req, res) => {
  const resumes = await Resume.find()
    .sort({ createdAt: -1 })
    .limit(9);

  return success(res, 200, "Resumes fetched successfully", resumes);
};

//get all placments
const getAllPlacements = async (req, res) => {
  const placements = await Placement.find()
    .sort({ createdAt: -1 })
    .limit(9);

  return success(res, 200, "Placements fetched successfully", placements);
};

//get all alumani
const getAllAlumni = async (req, res) => {
  const alumni = await Alumni.find()
    .sort({ createdAt: -1 })
    .limit(9);

  return success(res, 200, "Alumni fetched successfully", alumni);
};

//dashborad data
const getDashboardData = async (req, res) => {
  const [students, courses, resumes, placements, employees] =
    await Promise.all([
      Student.find().sort({ createdAt: -1 }).limit(9),
      Course.find().sort({ createdAt: -1 }).limit(9),
      Resume.find().sort({ createdAt: -1 }).limit(9),
      Placement.find().sort({ createdAt: -1 }).limit(9),
      Employee.find().select("-password -otp").limit(9),
    ]);

  return success(res, 200, "Dashboard data fetched successfully", {
    students,
    courses,
    resumes,
    placements,
    employees,
  });
};

export { getAllCourses, getCourseById, updateCourse, deleteCourse,
  getAllStudents, getStudentById, updateStudent, getAllEmployees, deleteStudent,
  getEmployeeById, getAllResumes, getAllPlacements, getAllAlumni, getDashboardData,
};
