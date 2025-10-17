import { useRef } from "react";
import { useNavigate } from "react-router";

export function LoginPage() {
  const navigate = useNavigate();

  let username = useRef<HTMLInputElement>(null);
  let password = useRef<HTMLInputElement>(null);

  let submitDetails = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Username: ${username.current!.value}, Password: ${password.current!.value}`);
  };

  return (
    <>
      <h1 onClick={() => navigate("/")}>MiniCord</h1>
      
      <div>
        <form onSubmit={submitDetails}>
          <label>Username</label>
          <input type="text" name="username" ref={username} required></input>
          <br/>
          
          <label>Password</label>
          <input type="password" name="password" ref={password} required></input>
          <br/>

          <button type="submit">Log In</button>
        </form>

        <hr/>
        <label>Or <a>sign up</a> instead</label>
      </div>
    </>
  );
}
