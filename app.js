if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();

const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const ExpressError = require("./utils/ExpressError");

const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");

const passport = require("passport");
const LocalStrategy = require("passport-local");

const adminRouter = require("./routes/admin");
const User = require("./models/user");

const listingRouter = require("./routes/listing");
const reviewsRouter = require("./routes/review");
const userRouter = require("./routes/user");
const bookingRouter = require("./routes/booking");
const tripPlannerRouter = require("./routes/tripPlanner");
const travelAssistantRouter = require("./routes/travelAssistant");
const wishlistRouter = require("./routes/wishlist");


const dbUrl =
  process.env.ATLASDB_URL ||
  "mongodb://127.0.0.1:27017/wanderlust";
// ======================
// DATABASE CONNECTION
// ======================

async function main() {
  await mongoose.connect(dbUrl);
  console.log("Connected to MongoDB");
}

main().catch((err) => {
  console.log("MongoDB Error:", err);
});

// ======================
// APP CONFIG
// ======================

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

// ======================
// SESSION STORE
// ======================

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET || "wanderlustsecret",
  },
  touchAfter: 24 * 3600,
});

store.on("error", (err) => {
  console.log("SESSION STORE ERROR:", err);
});

const sessionOptions = {
  store,
  secret: process.env.SECRET || "wanderlustsecret",
  resave: false,
  saveUninitialized: false,

  cookie: {
    expires: new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000
    ),
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  },
};

app.use(session(sessionOptions));
app.use(flash());

// ======================
// PASSPORT CONFIG
// ======================

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ======================
// GLOBAL VARIABLES
// ======================

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;

  next();
});

app.get("/privacy",(req,res)=>{

res.render("privacy");

});

app.get("/terms",(req,res)=>{

res.render("terms");

});

app.get("/contact",(req,res)=>{

res.render("contact");

});

// ======================
// ROUTES
// ======================

app.use("/trip-planner", tripPlannerRouter);
app.use("/travel-assistant", travelAssistantRouter);
app.use("/wishlist", wishlistRouter);
app.use("/listings", listingRouter);

app.use(
  "/listings/:id/reviews",
  reviewsRouter
);

app.use("/", userRouter);

 app.use("/bookings", bookingRouter);

 app.use("/admin", adminRouter);

// ======================
// 404 HANDLER
// ======================

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

// ======================
// ERROR HANDLER
// ======================

app.use((err, req, res, next) => {
  let {
    statusCode = 500,
    message = "Something went wrong!",
  } = err;

  res.status(statusCode).render("error.ejs", {
    message,
  });
});

// ======================
// SERVER
// ======================

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});