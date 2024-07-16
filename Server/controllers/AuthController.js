import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";

const maxAge = 3 * 24 * 60 * 60 * 1000;

const createToken = (email, userID) => {
  return jwt.sign({ email, userID }, process.env.JWT_KEY, {
    expiresIn: maxAge,
  });
};
export const signup = async (request, response, next) => {
  try {
    const { email, password } = request.body;

    if (!email || !password) {
      return response.status(400).send("Email and Password is required");
    }
    const user = await User.create({ email, password });

    response.cookie("jwt", createToken(email, user.id), {
      maxAge,
      secure: true,
      sameSite: "None",
    });

    return response.status(201).json({ user });
  } catch (error) {
    console.log({ error });
    return response.status(500).send("Internal Server Error");
  }
};
