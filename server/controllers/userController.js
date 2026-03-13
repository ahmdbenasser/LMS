import Course from "../models/Course.js";
import CourseProgress from "../models/CourseProgress.js";
import { Purchase } from "../models/Purchase.js";
import User from "../models/User.js";
import Stripe from "stripe";

export const getUserData = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.json({
        success: false,
        message: "User Not Found",
      });
    }

    res.json({
      success: true,
      user,
    });
  } catch (err) {
    res.json({
      success: false,
      message: err.message,
    });
  }
};

// Users Enrolled Courses With Lecture Links
export const userEnrolledCourses = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const userData = await User.findById(userId).populate("enrolledCourses");
    res.json({
      success: true,
      enrolledCourses: userData.enrolledCourses,
    });
  } catch (err) {
    res.json({
      success: false,
      message: err.message,
    });
  }
};

// make purchase course

export const purchaseCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const { origin } = req.headers;
    const userId = req.auth.userId;
    const courseData = await Course.findById(courseId);
    const userData = await User.findById(userId);

    if (!courseData || !userData) {
      return res.json({
        success: false,
        message: "Data not Found",
      });
    }

    const coursePrice = (
      courseData.coursePrice -
      (courseData.discount / 100) * 100
    ).toFixed(2);

    const purchaseData = {
      courseId: courseData._id,
      userId: userData._id,
      amounts: coursePrice,
    };

    const newPurchase = await Purchase.create(purchaseData);

    //Stripe Getway Initialize
    const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

    const currency = process.env.CURRENCY;

    const line_items = [
      {
        price_data: {
          currency,
          product_data: {
            name: courseData.courseTitle,
          },
          unit_amount: Math.floor(newPurchase.amounts) * 100,
        },
        quantity: 1,
      },
    ];
    const session = await stripeInstance.checkout.sessions.create({
      success_url: `${origin}/loading/my-enrollments`,
      cancel_url: `${origin}`,
      line_items: line_items,
      mode: "payment",
      metadata: {
        purchaseId: newPurchase._id.toString(),
      },
    });

    res.json({
      success: true,
      session_url: session.url,
    });
  } catch (err) {
    res.json({
      success: false,
      message: err.message,
    });
  }
};

// updare course progress for user
export const updateCourseProgress = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const { courseId, lectureId } = req.body;

    const courseData = await Course.findById(courseId);
    const userData = await User.findById(userId);

    if (!courseData || !userData || !lectureId) {
      return res.json({
        success: false,
        message: "Invalid Data",
      });
    }

    const progressData = await CourseProgress.findOne({ userId, courseId });

    if (progressData) {
      if (progressData.lectureCompleted.includes(lectureId)) {
        return res.json({
          success: true,
          message: "Lecture Already Completed",
        });
      }

      progressData.lectureCompleted.push(lectureId);
      await progressData.save();
    } else {
      await progressData.create({
        userId,
        courseId,
        lectureCompleted: [lectureId],
      });
    }

    res.json({
      success: true,
      message: "progress updated",
    });
  } catch (err) {
    res.json({
      success: false,
      message: err.message,
    });
  }
};

// get user progress course
export const getUserProgressCourse = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const { courseId } = req.body;

    const progressData = await CourseProgress.findeOne({
      userId,
      courseId,
    });

    res.json({
      success: true,
      progressData,
    });
  } catch (err) {
    res.json({
      success: false,
      message: err.message,
    });
  }
};

// add user rating
export const addUserRating = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const { courseId, rating } = req.body;

    if (!courseId || !userId || !rating || rating < 1 || rating > 5) {
      return res.json({
        success: false,
        message: "Invalid Data",
      });
    }

    const courseData = await Course.findById(courseId);
    if (!courseData) {
      return res.json({
        success: false,
        message: "course not found..!",
      });
    }

    const userData = await User.findById(userId);
    if (!userData || !courseData.enrolledStudents.includes(userId)) {
      return res.json({
        success: false,
        message: "user has not purchase this course",
      });
    }

    const existingUserRating = courseData.courseRating.findIndex(
      (r) => r.userId === userId,
    );
    if (existingUserRating) {
      courseData.courseRating[existingUserRating] = rating;
    }
    courseData.courseRating.push({ userId, rating });
    await courseData.save();
    return res.json({
      success: true,
      message: "Rating added",
    });
  } catch (err) {
    res.json({
      success: false,
      message: err.message,
    });
  }
};
