import { genToken } from "../../utils/genToken.js";
import { Auth } from "../models/auth.schema.js";

export const signup = async (req, res, next) => {
  try {
    const { userName, email, password } = req.body;
    if (!userName || !email || !password) {
      return res.status(400).json({
        message: "all fields are required",
      });
    }
    const isUserExist = await Auth.findOne({ email });
    if (isUserExist) {
      return res.status(400).json({
        message: "Email is already exist",
      });
    }

    const user = await Auth.create({
      userName,
      email,
      password,
    });

    return res.status(201).json({
      message: "user created successfully",
      data: {
        id: user._id,
        name: user.userName,
        email: user.email,
      },
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

export const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "all fields are required",
      });
    }
    const user = await Auth.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Password is incorrect",
      });
    }

    //  token:
    const token = await genToken(user._id, user.email, user.userName);
    if (!token) {
      return res.status(400).json({
        message: "Something went wrong",
      });
    }
    return res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({
        message: "signin successfully",
        data: {
          id: user._id,
          email: user.email,
          userName: user.userName,
        },
      });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};
