import Message from "../models/MessagesModel.js";

export const getMessages = async (request, response) => {
  try {
    const { selectedUserID } = request.body;
    const currentUserID = request.userID;

    if (!selectedUserID || !currentUserID) {
      return response.status(400).send("Both the user IDs are required");
    }

    const messages = await Message.find({
      $or: [
        { sender: selectedUserID, receiver: currentUserID },
        { receiver: selectedUserID, sender: currentUserID },
      ],
    }).sort({ timestamps: 1 });

    return response.status(200).json({ messages });
  } catch (error) {
    console.log({ error });
    return response.status(500).send("Internal Server Error");
  }
};
