import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";
import { compare } from "bcrypt";
import { renameSync, unlinkSync } from "fs";
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

    // User created code 201
    return response.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        profileSetup: user.profileSetup,
      },
    });
  } catch (error) {
    console.log({ error });
    return response.status(500).send("Internal Server Error");
  }
};

export const login = async (request, response, next) => {
  try {
    const { email, password } = request.body;
    if (!email || !password) {
      return response.status(400).send("Email and Password is required");
    }
    // Checking if user exist with this email
    const user = await User.findOne({ email: email });
    if (!user) {
      return response.status(404).send("User not found with this email");
    }

    //Checking if password is correct using Bcrypt
    const checkPassword = await compare(password, user.password);

    if (!checkPassword) {
      return response.status(400).send("Incorrect Password");
    }

    // Creating token and attaching it in cookie
    response.cookie("jwt", createToken(email, user.id), {
      maxAge,
      secure: true,
      sameSite: "None",
    });

    // sending user info back when sucess code 200
    return response.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        profileSetup: user.profileSetup,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
        color: user.color,
      },
    });
  } catch (error) {
    console.log({ error });
    return response.status(500).send("Internal Server Error");
  }
};

// Getting user info from JWT token
export const getUserInfo = async (request, response, next) => {
  try {
    const userID = request.userID;

    const user = await User.findById(userID);
    if (!user) {
      return response.status(404).send("User not found with this ID");
    }
    // sending user info back when sucess code 200
    return response.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        profileSetup: user.profileSetup,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
        color: user.color,
      },
    });
  } catch (error) {
    console.log({ error });
    return response.status(500).send("Internal Server Error");
  }
};

export const updateProfile = async (request, response) => {
  try {
    const userID = request.userID;
    const { firstName, lastName, color } = request.body;

    if (!firstName || !lastName) {
      return response.status(400).send("All fields are required");
    }

    const user = await User.findByIdAndUpdate(
      userID,
      {
        firstName,
        lastName,
        color,
        profileSetup: true,
      },
      { new: true, runValidators: true } // Send the updated data back
    );
    if (!user) {
      return response.status(404).send("User not found with this ID");
    }

    // sending user info back when sucess code 200
    return response.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        profileSetup: user.profileSetup,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
        color: user.color,
      },
    });
  } catch (error) {
    console.log({ error });
    return response.status(500).send("Internal Server Error");
  }
};

export const addProfileImage = async (request, response) => {
  try {
    const imageFile = request.file;
    console.log(imageFile);
    if (!imageFile) {
      return response.status(400).send("File is required");
    }

    // If image is recieved rename it before storing its path in database
    const date = Date.now();
    let fileName = "uploads/profiles/" + date + imageFile.originalname;

    // Rename the mutter generated random filename with the new filename on tha actual file location
    renameSync(imageFile.path, fileName);

    const userID = request.userID;

    const user = await User.findByIdAndUpdate(
      userID,
      {
        image: fileName,
      },
      { new: true, runValidators: true } // Send the updated data back
    );
    if (!user) {
      return response.status(404).send("User not found with this ID");
    }

    // sending user info back when sucess code 200
    return response.status(200).json({
      image: user.image,
    });
  } catch (error) {
    console.log({ error });
    return response.status(500).send("Internal Server Error");
  }
};
export const deleteProfileImage = async (request, response) => {
  try {
    const userID = request.userID;
    const { firstName, lastName, color } = request.body;

    if (!firstName || !lastName) {
      return response.status(400).send("All fields are required");
    }

    const user = await User.findByIdAndUpdate(
      userID,
      {
        firstName,
        lastName,
        color,
        profileSetup: true,
      },
      { new: true, runValidators: true } // Send the updated data back
    );
    if (!user) {
      return response.status(404).send("User not found with this ID");
    }

    // sending user info back when sucess code 200
    return response.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        profileSetup: user.profileSetup,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
        color: user.color,
      },
    });
  } catch (error) {
    console.log({ error });
    return response.status(500).send("Internal Server Error");
  }
};
