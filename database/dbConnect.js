import mongoose from "mongoose";

const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("MongoDB Connected Successfully");
  } catch (err) {
    console.error("Database Connection Failed : ", err.message);
  }
};

export default dbConnect;
