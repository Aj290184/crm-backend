import mongoose from "mongoose";

const alumniSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
      unique: true,
    },

    passingYear: {
      type: Number,
      required: true,
    },

    companyName: {
      type: String,
      required: true,
    },

    jobRole: {
      type: String,
      required: true,
    },

    location: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Alumni = mongoose.model("Alumni", alumniSchema);
export default Alumni;
