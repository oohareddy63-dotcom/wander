const User = require("../models/user");

module.exports.renderSignup = (req, res) => {
  res.render("users/signup", {
    success: res.locals.success || [],
    error: res.locals.error || [],
    currentUser: res.locals.currentUser || null,
  });
};

module.exports.signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const newUser = new User({ username, email });
    const registeredUser = await User.register(newUser, password);

    req.login(registeredUser, (err) => {
      if (err) return next(err);

      req.flash("success", "Welcome to Wanderlust!");
      res.redirect("/listings");
    });
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/signup");
  }
};

module.exports.renderLoginForm = (req, res) => {
  res.render("users/login", {
    success: res.locals.success || [],
    error: res.locals.error || [],
    currentUser: res.locals.currentUser || null,
  });
};

module.exports.login = (req, res) => {
  req.flash("success", "Welcome back to Wanderlust!");
  const redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);

    req.flash("success", "You are logged out!");
    res.redirect("/listings");
  });
};
