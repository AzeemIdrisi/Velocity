import axios from "axios";

const BACKEND_URL = "https://velocity-gn4l.onrender.com/api/auth";

export const UserLogin = async (email, password) => {
  try {
    const response = await axios.post(BACKEND_URL + "/login", {
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
    const response = await axios.post(BACKEND_URL + "/signup", {
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
    const response = await axios.get(BACKEND_URL + "/user-info", {
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
      BACKEND_URL + "/update-profile",
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
      BACKEND_URL + "/add-profile-image",
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
    const response = await axios.delete(BACKEND_URL + "/remove-profile-image", {
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
