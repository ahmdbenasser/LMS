import Course from "../models/Course.js";
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
