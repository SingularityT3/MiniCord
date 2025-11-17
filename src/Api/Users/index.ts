import minicord from "@/api";

// Get currently logged in user's full data
const getSelfAPI = async () => {
  return await minicord.get("/users/self");
};

// Get full user by ID (needed for loading conversation members)
const getUserAPI = async (id: string) => {
  return await minicord.get(`/users/${id}`);
};

// Get user by username (returns id + username)
const getUserByUsernameAPI = async (username: string) => {
  return await minicord.get(`/users/by-username/${username}`);
};

// Your existing function: returns only {id}
const getUserIdByUsernameAPI = async (username: string) => {
  return await minicord.get(`/users/by-username/${username}`);
};

// Get username by id (limited response)
const getUsernameByIdAPI = async (id: string) => {
  return await minicord.get(`/users/${id}`);
};

// Upload profile picture
const uploadProfilePictureAPI = async (id: string, file: File) => {
  const formData = new FormData();
  formData.append("avatar", file);

  return await minicord.post(`/users/${id}/profile`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// Fetch profile picture blob
const getProfilePictureAPI = async (id: string) => {
  return await minicord.get(`/users/${id}/profile`, {
    responseType: "blob",
  });
};

// Exports
export {
  getSelfAPI,
  getUserAPI,
  getUserByUsernameAPI,
  getUserIdByUsernameAPI,
  getUsernameByIdAPI,
  uploadProfilePictureAPI,
  getProfilePictureAPI,
};
