import mongoose from "mongoose";
import User from "../models/UserModel.js";
import Message from "../models/MessagesModel.js";

export const searchContacts = async (request, response) => {
  try {
    const { searchTerm } = request.body;
    const currentUserID = request.userID;

    if (!searchTerm) {
      return response.status(400).send("searchTerm is required");
    }

    const sanitizedSearchTerm = searchTerm.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&"
    );

    const regex = new RegExp(sanitizedSearchTerm, "i");

    const contacts = await User.find({
      $and: [
        { _id: { $ne: currentUserID } }, //Excluding the current logged in user
        {
          $or: [{ firstName: regex }, { lastName: regex }, { email: regex }],
        },
      ],
    });

    return response.status(200).json({ contacts });
  } catch (error) {
    console.log({ error });
    return response.status(500).send("Internal Server Error");
  }
};

export const getContactsForDmList = async (request, response) => {
  try {
    let currentUserID = request.userID;

    // Convert currentUserID to ObjectId
    currentUserID = new mongoose.Types.ObjectId(currentUserID);

    const contacts = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: currentUserID }, { receiver: currentUserID }],
        },
      },
      {
        $sort: {
          timestamp: -1,
        },
      },
      {
        $group: {
          _id: {
            $cond: {
              if: { $eq: ["$sender", currentUserID] },
              then: "$receiver",
              else: "$sender",
            },
          },
          lastMessageTime: { $first: "$timestamp" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "contactInfo",
        },
      },
      {
        $unwind: "$contactInfo",
      },
      {
        $project: {
          _id: 1,
          lastMessageTime: 1,
          email: "$contactInfo.email",
          firstName: "$contactInfo.firstName",
          lastName: "$contactInfo.lastName",
          image: "$contactInfo.image",
          color: "$contactInfo.color",
        },
      },
      {
        $match: {
          _id: { $ne: currentUserID }, // Exclude the current user
        },
      },
      {
        $sort: { lastMessageTime: -1 },
      },
    ]);

    return response.status(200).json({ contacts });
  } catch (error) {
    console.log({ error });
    return response.status(500).send("Internal Server Error");
  }
};
