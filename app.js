if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// DEPENDENCIES
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const ExpressError = require("./utils/ExpressError");
const User = require("./models/user");

//  ROUTES
const listingsRouter = require("./routes/listings");
const reviewsRouter = require("./routes/reviews");
const userRouter = require("./routes/user");

// DATABASE 
const dbUrl = process.env.DATABASE_URL; 

mongoose.set("strictQuery", true);

mongoose
  .connect(dbUrl, {
    serverSelectionTimeoutMS: 30000, 
  })
  .then(async () => {
    console.log("DB Connected");

  
    const existingEditor = await User.findOne({ username: "editor" });
    if (!existingEditor) {
      const editorUser = new User({
        username: "editor",
        email: "editor@example.com",
        role: "editor",
      });
      await User.register(editorUser, "editor123");
      console.log(
        "Default editor created (username: editor, password: editor123)"
      );
    }
  })
  .catch((err) => {
    console.error("DB ERROR:", err);
  });

//  VIEW ENGINE 
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//  MIDDLEWARE 
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

//  SESSION CONFIG 
const sessionOptions = {
  secret: process.env.SECRET, // from Render
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(flash());

//  PASSPORT 
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//  GLOBAL LOCALS 
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  next();
});

// ROUTES 
app.get("/", (req, res) => {
  res.redirect("/listings?filter=all");
});

app.use("/", userRouter);
app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);

app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

//  ERROR HANDLER 
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("error.ejs", {
    message,
    success: res.locals.success,
    error: res.locals.error,
    currentUser: res.locals.currentUser,
  });
});

//  SERVER 
const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
