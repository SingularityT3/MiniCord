import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, type NavigateFunction } from "react-router";
import axios, { AxiosError } from "axios";
import { URL } from "./main";
import styles from "./auth.module.css";

interface CaptionedInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  enableCaption: boolean;
  caption: string;
}

function CaptionedInput({
  enableCaption,
  caption,
  ...props
}: CaptionedInputProps) {
  return (
    <>
      <input {...props}></input>
      {enableCaption && (
        <>
          <br />
          <label className={styles.caption}>{caption}</label>
        </>
      )}
    </>
  );
}

function checkLoggedIn(navigate: NavigateFunction) {
  return () => {
    let jwt = localStorage.getItem("jwt");
    if (jwt) {
      navigate("/home");
    }
  };
}

export function LoginPage() {
  const navigate = useNavigate();

  useEffect(checkLoggedIn(navigate), []);

  let username = useRef<HTMLInputElement>(null);
  let password = useRef<HTMLInputElement>(null);

  let [submitting, setSubmitting] = useState(false);
  let [errMsg, setErrMsg] = useState("");

  let signupLink = useRef<HTMLAnchorElement>(null);

  let submitDetails = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    axios
      .post(URL + "/auth/login", {
        username: username.current!.value,
        password: password.current!.value,
      })
      .then((res) => {
        if (res.status !== 200 || res.data === "") {
          throw new Error("Unknown Error: Failed to login");
        }
        localStorage.setItem("jwt", res.data);
        navigate("/home");
      })
      .catch((err) => {
        if (err instanceof AxiosError) {
          if (err.status === 400) {
            setErrMsg("User does not exist. Did you mean to sign up?");
            signupLink.current!.focus();
          } else if (err.status === 401) {
            setErrMsg("Incorrect Password");
            password.current!.focus();
          }
        }
        setSubmitting(false);
      });
  };

  return (
    <div className={`${styles.login_bg} bg`}>
      <div className={styles.rightPanel}>
        <h1 onClick={() => navigate("/")} className={styles.minicord}>MiniCord</h1>

        <form onSubmit={submitDetails} className={styles.authForm}>
          <label htmlFor="username">Username</label>
          <br />
          <input
            type="text"
            name="username"
            id="username"
            ref={username}
            required
            className={errMsg === "User does not exist. Did you mean to sign up?" ? "invalid" : ""}
          ></input>
          <br />

          <label htmlFor="password">Password</label>
          <br />
          <input
            type="password"
            name="password"
            id="password"
            ref={password}
            required
            className={errMsg === "Incorrect Password" ? "invalid" : ""}
          ></input>
          <br />

          <button type="submit" disabled={submitting}>
            Log In
          </button>
          {errMsg !== "" && (
            <>
              <br />
              <label>{errMsg}</label>
            </>
          )}
        </form>

        <hr />
        <label>
          Or <Link to="/signup" ref={signupLink}>sign up</Link> instead
        </label>
      </div>
    </div>
  );
}

export function SignupPage() {
  const navigate = useNavigate();

  useEffect(checkLoggedIn(navigate), []);

  let [username, setUsername] = useState("");
  let [password, setPassword] = useState("");
  let [confirmPassword, setConfirmPassword] = useState("");

  let [usernameAvailable, setUsernameAvailable] = useState(true);
  let [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let timeout = setTimeout(() => {
      if (username === "") return;
      axios.get(URL + "/auth/checkuser?username=" + username).then((res) => {
        if (res.status === 200 && typeof res.data.available === "boolean") {
          setUsernameAvailable(res.data.available);
        }
      });
    }, 300);

    return () => clearTimeout(timeout);
  }, [username]);

  let submitDetails = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    axios
      .post(URL + "/auth/signup", {
        username: username,
        password: password,
      })
      .then((res) => {
        if (res.status === 200) {
          navigate("/login");
        } else {
          throw new Error(res.statusText);
        }
      })
      .catch((err) => {
        setSubmitting(false);
        console.error("Failed to signup user\n", err);
      });
  };

  return (
    <div className={`${styles.login_bg} bg`}>
      <div className={styles.rightPanel}>
        <h1 onClick={() => navigate("/")} className={styles.minicord}>MiniCord</h1>
        <form onSubmit={submitDetails} className={styles.authForm}>
          <label htmlFor="username">Username</label>
          <CaptionedInput
            type="text"
            name="username"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            enableCaption={!usernameAvailable}
            caption="❌ username is not available"
            className={usernameAvailable ? "" : "invalid"}
          ></CaptionedInput>
          <br />

          <label htmlFor="password">Password</label>
          <br />
          <input
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          ></input>
          <br />

          <label htmlFor="confirm_password">Confirm Password</label>
          <br />
          <CaptionedInput
            type="password"
            id="confirm_password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            enableCaption={confirmPassword !== ""}
            caption={
              password === confirmPassword
                ? "✅ Passwords match"
                : "❌ Passwords do not match!"
            }
            className={confirmPassword === "" || password === confirmPassword ? "" : "invalid"}
          ></CaptionedInput>
          <br />

          <button
            type="submit"
            disabled={submitting || !usernameAvailable || (password !== confirmPassword && confirmPassword !== "")}
          >
            Sign up
          </button>
        </form>

        <hr />
        <label>
          Or <Link to="/login">log in</Link> instead
        </label>
      </div>
    </div>
  );
}
