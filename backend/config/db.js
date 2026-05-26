import mongoose from "mongoose";

export const db = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("connected Database");
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};
