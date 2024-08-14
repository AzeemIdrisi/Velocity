import axios from "axios";

const AUTH_ROUTE = "https://velocity-gn4l.onrender.com/api/auth";
const CONTACTS_ROUTE = "https://velocity-gn4l.onrender.com/api/contacts";

export const UserLogin = async (email, password) => {
  try {
    const response = await axios.post(AUTH_ROUTE + "/login", {
      email,
      password,
    });
    return response;
  } catch (error) {
    console.log("Auth.js", { error });
    return error.response;
  }
};
export const UserRegister = async (email, password) => {
  try {
    const response = await axios.post(AUTH_ROUTE + "/signup", {
      email,
      password,
    });
    return response;
  } catch (error) {
    console.log("Auth.js", { error });
    return error.response;
  }
};
export const GetUserInfo = async (token) => {
  try {
    const response = await axios.get(AUTH_ROUTE + "/user-info", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  } catch (error) {
    console.log("Auth.js", { error });
    return error.response;
  }
};
export const UpdateProfile = async (token, firstName, lastName) => {
  try {
    const response = await axios.post(
      AUTH_ROUTE + "/update-profile",
      {
        firstName,
        lastName,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response;
  } catch (error) {
    console.log("Auth.js", { error });
    return error.response;
  }
};
export const AddProfileImage = async (token, formData) => {
  try {
    const response = await axios.post(
      AUTH_ROUTE + "/add-profile-image",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response;
  } catch (error) {
    console.log("Auth.js", { error });
    return error.response;
  }
};
export const RemoveProfileImage = async (token) => {
  try {
    const response = await axios.delete(AUTH_ROUTE + "/remove-profile-image", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  } catch (error) {
    console.log("Auth.js", { error });
    return error.response;
  }
};
export const SearchContacts = async (token, searchTerm) => {
  try {
    const response = await axios.post(
      CONTACTS_ROUTE + "/search",
      { searchTerm },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response;
  } catch (error) {
    console.log("Auth.js", { error });
    return error.response;
  }
};
