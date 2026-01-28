
if(process.env.NODE_ENV != "production"){
require('dotenv').config();
}

console.log(process.env);

//  DEPENDENCIES
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override"); // Enables PUT/DELETE in forms
const ejsMate = require("ejs-mate");              // Enhanced EJS templating
const session = require("express-session");       // Session management

const flash = require("connect-flash");           // Flash messages for user feedback
const passport = require("passport");             // Authentication middleware
const LocalStrategy = require("passport-local");  // Local username/password strategy
const ExpressError = require("./utils/ExpressError"); // Custom error handling


const User = require("./models/user");

//  ROUTE IMPORTS 
const listingsRouter = require("./routes/listings");  // Property listings routes
const reviewsRouter = require("./routes/reviews");    // Review system routes
const userRouter = require("./routes/user");          // User authentication routes
const dbUrl = "mongodb://127.0.0.1:27017/wander";
// DATABASE CONNECTION 
mongoose
  .connect(dbUrl)
  .then(async () => {
    console.log("DB Connected");

   
    try {
      const existingEditor = await User.findOne({ username: "editor" });
      if (!existingEditor) {
        const editorUser = new User({
          username: "editor",
          email: "editor@example.com",
          role: "editor",
        });

        
        await User.register(editorUser, "editor123");
        console.log(
          "Default editor user created (username: editor, password: editor123)"
        );
      }
    } catch (err) {
      console.error("Error creating default editor user:", err);
    }
  })
  .catch((err) => console.log(err));

// VIEW ENGINE CONFIGURATION 
app.engine("ejs", ejsMate);                    // Use EJS-Mate for enhanced templating
app.set("view engine", "ejs");                 // Set EJS as template engine
app.set("views", path.join(__dirname, "views")); // Set views directory

// MIDDLEWARE SETUP 
app.use(express.urlencoded({ extended: true })); // Parse form data
app.use(methodOverride("_method"));              // Enable HTTP method override
app.use(express.static(path.join(__dirname, "public"))); // Serve static files


// SESSION CONFIGURATION 
const sessionOptions = {
  secret: "thisshouldbeabettersecret!",  // Session encryption key
  resave: false,                         // Don't save session if unmodified
  saveUninitialized: true,               // Save new sessions
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days expiration
    maxAge: 7 * 24 * 60 * 60 * 1000,               // 7 days max age
    httpOnly: true,                                  // Prevent XSS attacks
  },
};

app.use(session(sessionOptions));


app.use(flash()); // Enable flash messages

// PASSPORT AUTHENTICATION SETUP 
app.use(passport.initialize());  // Initialize Passport
app.use(passport.session());     // Enable persistent login sessions

// Configure Passport to use Local Strategy with User model
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());     // Serialize user for session
passport.deserializeUser(User.deserializeUser()); // Deserialize user from session


app.use((req, res, next) => {
  res.locals.success = req.flash("success") || [];    // Success messages (always array)
  res.locals.error = req.flash("error") || [];        // Error messages (always array)
  res.locals.currentUser = req.user || null;          // Currently logged in user
  next();
});


app.get("/", (req, res) => {
  res.redirect("/listings?filter=all");
});

// Mount route modules
app.use("/", userRouter);                    // Authentication routes (login, signup, logout)
app.use("/listings", listingsRouter);       // Listing CRUD operations
app.use("/listings/:id/reviews", reviewsRouter); // Review system for listings


app.all(/.*/, (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

// Global error handler - catches all errors and renders error page
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("error.ejs", { 
    message,
    success: res.locals.success || [],
    error: res.locals.error || [],
    currentUser: res.locals.currentUser || null,
  });
});

// SERVER STARTUP 
app.listen(8080, () => {
  console.log("Server running on port 8080");
  console.log("Visit: http://localhost:8080");
  console.log("Default login: username=editor, password=editor123");
});
