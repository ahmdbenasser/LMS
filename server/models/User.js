import mongoose from "mongoose";
import { EventTypeImportOpenApiIn } from "svix";

const userSchema = new mongoose.Schema(
  {
    _id: { type: String, require: true },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    enrolledCourses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        req: "Course",
      },
    ],
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);
export default User;
