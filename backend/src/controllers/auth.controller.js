import User from "../models/User.js";
import jwt from "jsonwebtoken";

// Signup Route

// SIGNUP ROUTE WILL DO THE FOLLOWING STEPS:
// 1. Validate Input - any field is missing, password length, email format
// 2. Check if User Already Exists - by email
// 3. Create New User - get a random profile picture from https://avatar.iran.liara.run/, create user instance
// 4. Generate JWT Token and Set Cookie - create JWT token, put token in response cookie, send response

// STATUS CODES TO USE:
// 409 - Conflict (email already exists)
// 201 - Created
// 400 - Bad Request (missing fields, invalid input)
// 401 - Unauthorized (invalid credentials)
// 500 - Internal Server Error (server error)

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    // STEP 1: Validate Input

    // Check for missing fields
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }
    // check if password is less than 6 characters
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long." });
    }

    // create a regular expression to validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ message: "Please enter a valid email address." });
    }

    // STEP 2: Check if User Already Exists

    // check if user already exists by email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        message: "Email already exists, please use a different email.",
      });
    }

    // STEP 3: Create New User

    //get a random profile picture from https://avatar.iran.liara.run/
    const avatarId = Math.floor(Math.random() * 100 + 1);
    const profilePicture = `https://avatar.iran.liara.run/public/${avatarId}.png`;

    // Create a new user instance
    const newUser = await User.create({
      email,
      fullName,
      password,
      profilePicture,
    });

    // STEP 4: Generate JWT Token and Set Cookie

    // create a JWT token for the user
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // put the token in the response cookie
    res.cookie("jwt", token, {
      // 7 days * 24 hours * 60 minutes * 60 seconds * 1000 milliseconds => 7 days
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      httpOnly: true, // prevent XSS attacks
      sameSite: "strict", // prevent CSRF attacks
      secure: process.env.NODE_ENV === "production", // set to true in production
    });

    // 201 status code means created, send the success response with user object
    res.status(201).json({
      success: true,
      user: newUser,
    });
  } catch (error) {
    // show the error in the console
    console.log("Error in Signup controller:", error);

    // 500 status code means internal server error
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Login Route

// LOGIN ROUTE WILL DO THE FOLLOWING STEPS:
// 1. Validate Input - any field is missing
// 2. Check if User Exists - by email
// 3. Check if Password is Correct - using bcryptjs compare method
// 4. Generate JWT Token and Set Cookie - create JWT token, put token in response cookie, send response

// STATUS CODES TO USE:
// 200 - OK (successful login)
// 400 - Bad Request (missing fields)
// 401 - Unauthorized (invalid credentials)
// 500 - Internal Server Error (server error)

export const login = async (req, res) => {
  try {
    // get email and password from request body
    const { email, password } = req.body;

    // STEP 1: Validate Input

    // check for missing fields
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // STEP 2: Check if User Exists

    // find the user by email
    const user = await User.findOne({ email });

    // if user not found, send error response
    if (!user)
      return res.status(401).json({ message: "Invalid email or password." });

    // STEP 3: Check if Password is Correct

    // check if password matches using our custom method in User model
    const isPasswordCorrect = await user.matchPasswords(password);
    if (!isPasswordCorrect)
      return res.status(401).json({ message: "Invalid email or password." });

    // create a JWT token for the user
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // put the token in the response cookie
    res.cookie("jwt", token, {
      // 7 days * 24 hours * 60 minutes * 60 seconds * 1000 milliseconds => 7 days
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      httpOnly: true, // prevent XSS attacks
      sameSite: "strict", // prevent CSRF attacks
      secure: process.env.NODE_ENV === "production", // set to true in production
    });

    // send the success response with user object
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log("Error in Login controller:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Logout Route
export const logout = (req, res) => {
  res.clearCookie("jwt", );
  res.status(200).json({ message: "Logged out successfully" });
};
