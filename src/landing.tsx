import { useNavigate } from "react-router";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <>
      <h1>MiniCord</h1>
      <p>A messaging app inspired by Discord.</p>
      <br/>
      <button onClick={() => navigate("/login")}>Log In</button>
    </>
  );
}
