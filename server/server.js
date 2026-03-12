import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import { clerkWebhooks, stripeWebhooks } from "./controllers/webhooks.js";
import educatorRouter from "./routes/educatorRoutes.js";
import { clerkMiddleware } from "@clerk/express";
import connectCloudinary from "./config/cloudinary.js";
import courseRouter from "./routes/courseRoutes.js";
import userRouter from "./routes/userRoutes.js";

// Initialize Express
const app = express();

// Connected to database
await connectDB();
await connectCloudinary();

// Middlewares
app.use(cors());

// --- التعديل هنا: استثنينا مسار السترايب من الـ Clerk Middleware ---
app.use(
  clerkMiddleware({
    ignoredRoutes: ["/stripe"],
  }),
);

// Routes
app.get("/", (req, res) => res.send("Api working"));

// السترايب لازم يكون قبل أي middleware تاني بيحاول يحلل الـ body زي express.json()
app.post("/stripe", express.raw({ type: "application/json" }), stripeWebhooks);

// باقي الراوتات اللي بتحتاج json
app.post("/clerk", express.json(), clerkWebhooks);
app.use("/api/educator", express.json(), educatorRouter);
app.use("/api/course", express.json(), courseRouter);
app.use("/api/users", express.json(), userRouter);

// Port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`server is Running on port ${PORT}`);
});
