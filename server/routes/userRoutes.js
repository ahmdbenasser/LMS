import express from "express";
import {
  addUserRating,
  getUserData,
  getUserProgressCourse,
  purchaseCourse,
  updateCourseProgress,
  userEnrolledCourses,
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/data", getUserData);
userRouter.get("/enrolled-courses", userEnrolledCourses);
userRouter.post("/purchase", purchaseCourse);
userRouter.post("/update-course-progress", updateCourseProgress);
userRouter.get("/get-course-progress", getUserProgressCourse);
userRouter.post("/add-rating", addUserRating);

export default userRouter;
