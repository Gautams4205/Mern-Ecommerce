// Importing required modules
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { User } = require("./model/User");
const crypto = require("crypto");
const cookieParser = require("cookie-parser");
const JwtStrategy = require("passport-jwt").Strategy;
const { Order } = require("./model/Order");
const path = require("path");

// Importing route files for different entities
const productRouter = require("./routes/Product");
const brandRouter = require("./routes/Brand");
const categoryRouter = require("./routes/Category");
const userRouter = require("./routes/User");
const authRouter = require("./routes/Auth");
const cartRouter = require("./routes/Cart");
const orderRouter = require("./routes/Order");
const { isAuth, sanitizeuser, cookieExtractor } = require("./services/common");

const opts = {};

opts.jwtFromRequest = cookieExtractor;
opts.secretOrKey = process.env.JWT_SECRET_KEY;

// Creating an Express server instance
const server = express();

// Function to establish a connection to the MongoDB database
async function main() {
  await mongoose.connect(process.env.MONGODB_URL); // Connect to the Ecommerce database
  console.log("Database connected Successfully"); // Log successful connection
}

const endpointSecret = process.env.ENDPOINT_SECRET;
server.post("/webhook", express.raw({ type: "application/json" }), async (request, response) => {
  const sig = request.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    console.log(event)
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }
  switch (event.type) {
    case "payment_intent.succeeded":
      const paymentIntentSucceeded = event.data.object;
      let order = await Order.findById(paymentIntentSucceeded.metadata.orderId);
      order.PaymentStatus = "received";
      await order.save();

      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  response.send();
});

// Middleware to parse JSON in incoming request bodies
server.use(express.static(path.resolve(__dirname, "build")));
server.use(express.json());
server.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
    cookie: { secure: true },
  })
);

server.use(cookieParser());
server.use(passport.authenticate("session"));

server.use(
  cors({
    origin: "http://localhost:3000", // Allow all origins
    exposedHeaders: ["X-Total-Count"],
  })
);
// Setting up routes with base paths for different entities
server.use("/products", isAuth(), productRouter.router); // Routes for product-related operations
server.use("/brands", isAuth(), brandRouter.router); // Routes for brand-related operations
server.use("/categories", isAuth(), categoryRouter.router); // Routes for category-related operations
server.use("/users", isAuth(), userRouter.router); // Routes for user-related operations
server.use("/auth", authRouter.router); // Routes for auth-related operations
server.use("/cart", isAuth(), cartRouter.router); // Routes for cart-related operations
server.use("/orders", isAuth(), orderRouter.router); // Routes for order-related operations
server.get("*", (req, res) => res.sendFile(path.resolve("build", "index.html")));

passport.use(
  "local",
  new LocalStrategy({ usernameField: "email" }, async function (email, password, done) {
    try {
      const user = await User.findOne({ email: email }).exec();
      if (!user) {
        done(null, false, { message: "no such user email" });
      }
      crypto.pbkdf2(password, user.salt, 310000, 32, "sha256", function (err, hashedPassword) {
        if (!crypto.timingSafeEqual(user.password, hashedPassword)) {
          return done(null, false, { message: "Invalid credentials" });
        } else {
          const token = jwt.sign(sanitizeuser(user), process.env.JWT_SECRET_KEY);
          return done(null, { id: user.id, role: user.role, token: token });
        }
      });
    } catch (err) {
      done(err);
    }
  })
);

passport.use(
  "jwt",
  new JwtStrategy(opts, async function (jwt_payload, done) {
    try {
      const user = await User.findById(jwt_payload.id);
      if (user) {
        return done(null, sanitizeuser(user));
      } else {
        return done(null, false);
        // or you could create a new account
      }
    } catch (err) {
      return done(err, false);
    }
  })
);

passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, { id: user.id, role: user.role });
  });
});

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

//Payment-intent
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

server.post("/create-payment-intent", async (req, res) => {
  const { totalAmount, orderId } = req.body;

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: totalAmount * 100, // for decimal compensation
    currency: "inr",
    automatic_payment_methods: {
      enabled: true,
    },
    metadata: {
      orderId,
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});

// Call the main function to establish a database connection
// Catch and log any errors during the connection process
main().catch((error) => {
  console.log(error);
});

// Start the server and listen on port 8080
server.listen(process.env.PORT, () => {
  console.log("Server is running Successfully"); // Log successful server start
});
