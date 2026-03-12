import express from "express";

import {
  educatorDashboardData,
  updateRoleToEducator,
} from "../controllers/educatorController.js";
import upload from "../config/multer.js";
import { protectEducator } from "../middlewares/authMiddleware.js";
import { addCourse } from "../controllers/educatorController.js";
import {
  getEducatorCourses,
  getEnrolledStudentsData,
} from "../controllers/educatorController.js";

const educatorRouter = express.Router();

// Add Educator Route
educatorRouter.get("/update-role", updateRoleToEducator);
educatorRouter.post(
  "/add-course",
  upload.single("image"),
  protectEducator,
  addCourse,
);
educatorRouter.get("/courses", protectEducator, getEducatorCourses);
educatorRouter.get("/dashboard", protectEducator, educatorDashboardData);
educatorRouter.get(
  "/enrolled-students",
  protectEducator,
  getEnrolledStudentsData,
);

export default educatorRouter;
