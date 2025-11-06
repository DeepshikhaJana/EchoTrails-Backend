import User from "../Models/userModel.js";
import bcrypt from "bcryptjs";
import generateAccessToken from "../Utils/generateAccessToken.js";
import generateRefreshToken from "../Utils/generateRefreshToken.js";
import generateOTP from "../Utils/generateOTP.js";
import generatedOtp from "../Utils/generateOTP.js";
import otpTemplate from "../Utils/otpTemplate.js"

//signUp Controller
export const signUp = async (req, res) => {
  try {
    const { username, name, email, password, dob, profilePic } = req.body;

    // Validate required fields
    if (!username || !name || !email || !password || !dob || !profilePic) {
      return res.status(400).json({
        message:
          "Username, name, email, password, date of birth and profile picture are required",
        error: true,
        success: false,
      });
    }

    // Check for existing user (by email or username)
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User with this email or username already exists",
        error: true,
        success: false,
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP for email verification
    const create_password_otp = generatedOtp(); // e.g. 6-digit code
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // expires in 5 minutes

    // Create new user
    const newUser = await User.create({
      username,
      name,
      email,
      password: hashedPassword,
      dob,
      profile_pic: profilePic, // ✅ matches your schema field name
      create_password_otp,
      password_otp_expiry: otpExpiry,
      isVerified: false, // optional, can be used later
    });

    // Send OTP via email
    await generateOTP({
      reciver: newUser.email,
      subject: "Verify your email",
      html: otpTemplate({
        name: newUser.name,
        otp: create_password_otp,
      }),
    });

    res.status(201).json({
      message: "User registered successfully. OTP sent to email.",
      success: true,
      userId: newUser._id,
    });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({
      message: error.message || "Server error",
      error: true,
      success: false,
    });
  }
};

//user login controller
export const loginUser = async(req, res) => {
    try{
        const{email, password} = req.body;
        if(!email || !password){
            return res.status(400).json({msg: "Email & password are required"});
        }
        const user = await User.findOne({email});
        if(!user){
            return res.status(404).json({msg: "User not found"});
        }
        const pswd = await bcrypt.compare(password, user.password);
        if(!pswd){
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // const hashedPassword = await bcrypt.hash(password, 10);
        // user.password = hashedPassword;
        // user.status = "Active";
        // await user.save();

        const accessToken = await generateAccessToken(user._id);
        const refreshToken = await generateRefreshToken(user._id);
        user.refreshToken = refreshToken;
        user.status = "Active";
        await user.save();

        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // true only in prod
            sameSite: "None",
        };

        res.cookie("accessToken", accessToken, cookieOptions);
        res.cookie("refreshToken", refreshToken, cookieOptions);

        return res.status(200).json({
        message: "Login successful",
        error: false,
        success: true,
        data: {
            id: user._id,
            name: user.name,
            email: user.email,
            accessToken,
            refreshToken,
        },
    });
    }
    catch(error){
        console.error("Error logging in:", error);
        return res.status(500).json({
            message: error.message || "Internal server error",
            error: true,
            success: false,
        });
    }
}

//user logout Controller
export async function logoutUser(req, res) {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized user",
        error: true,
        success: false,
      });
    }

    // Clear cookies
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
    };

    res.clearCookie("accessToken", cookieOptions);
    res.clearCookie("refreshToken", cookieOptions);

    // Remove stored refresh token in DB
    await User.findByIdAndUpdate(userId, { refresh_token: "" });

    return res.status(200).json({
      message: "Logout successful",
      error: false,
      success: true,
    });
  } catch (error) {
    console.error("Error during logout:", error);
    return res.status(500).json({
      message: error.message || "Internal server error",
      error: true,
      success: false,
    });
  }
}
