if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dbUrl = process.env.MONGO_URL;
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/expressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));
app.engine("ejs", ejsMate);

async function main() {
  await mongoose.connect(dbUrl);
}
main()
  .then(() => {
    console.log("Connect to Db");
  })
  .catch((err) => {
    console.log(err);
  });

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET_CODE,
  },
  touchAfter: 24 * 3600,
});

const sessionOptions = {
  store,
  secret: process.env.SECRET_CODE,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

store.on("err", () => {
  console.log("ERROR in MONGO SESSION STORE", err);
});

app.use(session(sessionOptions));
app.use(flash()); // it should be before the routes (which we require like listing, review)

// For passport (password verification) passport uses pbkdf2 hashing algo for password
app.use(passport.initialize()); // for passport
app.use(passport.session()); // for passport
passport.use(new LocalStrategy(User.authenticate())); // for passport-local-mongoose

passport.serializeUser(User.serializeUser()); // for passport-local-mongoose
passport.deserializeUser(User.deserializeUser()); // for passport-local-mongoose

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

// Root
app.get("/", (req, res) => {
  res.redirect("/listings");
});

// All other route
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

// Error Validation (Handling async err)
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong !" } = err;
  res.status(statusCode).render("listings/error.ejs", { message });
});

app.listen(8080, () => {
  console.log("Server is listening port 8080");
});
