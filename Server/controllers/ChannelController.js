import mongoose from "mongoose";
import Channel from "../models/ChannelModel.js";
import User from "../models/UserModel.js";

export const createChannnel = async (request, response) => {
  try {
    const { name, members } = request.body;

    const userId = request.userID;

    const admin = await User.findById(userId);

    if (!admin) {
      return response.status(400).send("Admin user not found");
    }

    const validUsers = await User.find({ _id: { $in: members } });

    if (validUsers.length !== members.length) {
      return response.status(400).send("Some members are not valid users");
    }

    const newChannel = new Channel({
      name,
      members,
      admin: userId,
    });
    await newChannel.save();
    return response.status(201).json({ channel: newChannel });
  } catch (error) {
    console.log({ error });
    return response.status(500).send("Internal Server Error");
  }
};

export const getUsersChannels = async (request, response) => {
  try {
    const userId = new mongoose.Types.ObjectId(request.userID);
    console.log(userId);
    const channels = await Channel.find({
      $or: [{ admin: userId }, { members: userId }],
    }).sort({ updatedAt: -1 });

    return response.status(200).json({ channels });
  } catch (error) {
    console.log({ error });
    return response.status(500).send("Internal Server Error");
  }
};
