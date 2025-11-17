import minicord from "@/api";

const getSelfAPI = async () => {
  return await minicord.get("/users/self");
};

const getUserIdByUsernameAPI = async (username: string) => {
  return await minicord.get(`/users/by-username/${username}`);
};

const getUsernameByIdAPI = async (id: string) => {
  return await minicord.get(`/users/${id}`);
};

const uploadProfilePictureAPI = async (id: string, file: File) => {
  const formData = new FormData();
  formData.append("avatar", file);

  return await minicord.post(`/users/${id}/profile`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

const getProfilePictureAPI = async (id: string) => {
  return await minicord.get(`/users/${id}/profile`, {
    responseType: "blob",
  });
};

export {
  getSelfAPI,
  getUserIdByUsernameAPI,
  getUsernameByIdAPI,
  uploadProfilePictureAPI,
  getProfilePictureAPI,
};