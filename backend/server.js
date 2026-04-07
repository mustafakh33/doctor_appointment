const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
dotenv.config({ path: "config.env" });
const morgan = require("morgan");
const cors = require("cors");
const ApiError = require("./utils/apiError");
const globalError = require("./middlewares/error.middleware");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const categoryRoutes = require("./routes/category.routes");
const doctorRoutes = require("./routes/doctor.routes");
const appointmentRoutes = require("./routes/appointment.routes");
const slotRoutes = require("./routes/slot.routes");
const scheduleRoutes = require("./routes/schedule.routes");
const reviewRoutes = require("./routes/review.routes");
const clinicRoutes = require("./routes/clinic.routes");
const notificationRoutes = require("./routes/notification.routes");
const adminRoutes = require("./routes/admin.routes");
const doctorDashboardRoutes = require("./routes/doctor.dashboard.routes");
const paymentRoutes = require("./routes/payment.routes");
require("./utils/appointmentReminder");
const dbConnection = require("./db/database");


dbConnection();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode: ${process.env.NODE_ENV}`);
}

const mountApiRoutes = (basePath) => {
  app.use(`${basePath}/auth`, authRoutes);
  app.use(`${basePath}/users`, userRoutes);
  app.use(`${basePath}/categories`, categoryRoutes);
  app.use(`${basePath}/doctors`, doctorRoutes);
  app.use(`${basePath}/appointments`, appointmentRoutes);
  app.use(`${basePath}/slots`, slotRoutes);
  app.use(`${basePath}/schedules`, scheduleRoutes);
  app.use(`${basePath}/reviews`, reviewRoutes);
  app.use(`${basePath}/clinic`, clinicRoutes);
  app.use(`${basePath}/notifications`, notificationRoutes);
  app.use(`${basePath}/admin`, adminRoutes);
  app.use(`${basePath}/doctor`, doctorDashboardRoutes);
  app.use(`${basePath}/payments`, paymentRoutes);
};

mountApiRoutes("/api");
mountApiRoutes("/api/v1");

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.all("*splat", (req, res, next) => {
  next(new ApiError(`Can't find this route: ${req.originalUrl}`, 404));
});

app.use(globalError);


const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});





// const ApiError = require("./utils/apiError");
// const globalError = require("./middlewares/errorMiddleware");
// const dbConnection = require("./config/database");

// // Routes

// // connect to db
// dbConnection();

// // express app


// //

//  Middlewares
// app.use(express.json()); // Parse incoming JSON requests into JavaScript objects
// app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // This allows direct access to uploaded files (e.g. images) via the browser


// Mount Routes
// app.use("/api/v1/categories", categoryRoute);
// app.use("/api/v1/subcategories", subCategoryRoute);
// app.use('/api/v1/brands', brandRoute);
// app.use('/api/v1/products', productRoute);

// Handle unknown routes (Not Found)
// app.use((req, res, next) => {
//   next(new ApiError(`Can't find this route: ${req.originalUrl}`, 400));
// });


// Global Error Handing Middleware
// app.use(globalError);

// const port = process.env.PORT || 8000;
// const server = app.listen(port, () => {
//   console.log(`App running on port ${port}`);
// });

// Handle rejection outside express
// process.on('unhandledRejection', (err) => {
//   console.error(`UnhandledRejection Errors: ${err.name} | ${err.message}`);
//   server.close(() => {
//     console.error(`Shutting down....`);
//     process.exit(1);
//   });
// });

