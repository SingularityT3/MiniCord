import { useEffect } from "react";
import { useNavigate } from "react-router";

export default function HomePage() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("jwt")) navigate("/login");
  }, []);

  const logout = () => {
    localStorage.removeItem("jwt");
    navigate("/login");
  };

  return (
    <>
      <h1>You are logged in</h1>
      <button onClick={logout}>Log out</button>
    </>
  );
}
