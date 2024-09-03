import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URL);
    console.log(
      `mongodb connected successfully. ${connection.connection.host}`
    );
  } catch (error) {
    console.log(error);
  }
};
export default connectDB;
