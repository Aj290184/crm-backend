import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    courseName: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    duration: {
      type: String,
      required: true,
    },

    fee: {
      type: Number,
      required: true,
    },

    courseImg: {
      type: String,
      required: true,
    },

    syllabus: [
      {
        type: String,
      }
    ],

    eligibility: {
      type: String,
      trim: true,
    },

    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },

    mode: {
      type: String,
      enum: ["Online", "Offline", "Hybrid"],
      default: "Offline",
    },

    instructor: {
      name: {
        type: String,
        trim: true,
      },
      experience: {
        type: String,
      },
    },

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },

    startDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

const Course = mongoose.model("Course", courseSchema);
export default Course;
