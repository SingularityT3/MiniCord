import minicord from "@/api";

const loginAPI = async (username: string, password: string) => {
  const payload = {
    username: username,
    password: password,
  };
  return await minicord.post("/auth/login", payload);
};

const signupAPI = async (
  username: string,
  password: string,
) => {
  const payload = {
    username: username,
    password: password,
  };
  return await minicord.post("/auth/signup", payload);;
};

const checkUserNameAPI = async (username: string) => {
  return await minicord.get(`/checkuser/${username}`);
};

export {
  loginAPI,
  signupAPI,
  checkUserNameAPI,
};
