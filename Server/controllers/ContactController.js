import User from "../models/UserModel.js";

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
