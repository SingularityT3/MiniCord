import { useState } from "react";
import { NavLink } from "react-router";
import { signupAPI } from "@/Api/Auth";
import { useAuth } from "@/context/User";

const Signup: React.FC = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await signupAPI(username, password);

      if (res.status === 201) {
        setSuccess("Account created successfully! Logging you in...");
        await login(username, password);
        // navigate("/dashboard")
      }
    } catch (err: any) {
      console.error(err);
      if (err.response?.status === 409) setError("Username is already taken.");
      else if (err.response?.status === 400)
        setError("Password must be at least 8 characters long.");
      else setError("Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-linear-to-br from-purple-100 via-white to-purple-50 dark:from-[#0f021f] dark:via-[#120427] dark:to-[#1a0535] transition-colors duration-500 relative">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_600px_at_50%_200px,rgba(168,85,247,0.2),transparent_80%)] dark:bg-[radial-gradient(circle_600px_at_50%_200px,rgba(139,92,246,0.25),transparent_85%)]"></div>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md mx-4 bg-white/40 dark:bg-[#0f021f]/40 backdrop-blur-lg border border-purple-300/30 dark:border-purple-800/40 rounded-2xl shadow-lg p-8 transition-colors"
      >
        <h1 className="text-3xl font-semibold text-center text-purple-700 dark:text-purple-400 mb-6">
          Create Account
        </h1>

        {/* Username */}
        <label
          htmlFor="username"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Username
        </label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="block w-full px-4 py-3 mb-4 border border-purple-300/40 dark:border-purple-800/40 rounded-md bg-white/70 dark:bg-[#16062e]/60 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
          placeholder="Choose a username"
          required
        />

        {/* Password */}
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="block w-full px-4 py-3 mb-4 border border-purple-300/40 dark:border-purple-800/40 rounded-md bg-white/70 dark:bg-[#16062e]/60 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
          placeholder="Enter a strong password"
          required
        />

        {/* Confirm Password */}
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="block w-full px-4 py-3 mb-6 border border-purple-300/40 dark:border-purple-800/40 rounded-md bg-white/70 dark:bg-[#16062e]/60 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
          placeholder="Re-enter your password"
          required
        />

        {/* Error */}
        {error && (
          <p className="text-red-500 text-sm text-center mb-4">{error}</p>
        )}
        {/* Success */}
        {success && (
          <p className="text-green-500 text-sm text-center mb-4">{success}</p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full inline-flex items-center justify-center ${
            loading
              ? "bg-purple-400 cursor-not-allowed"
              : "bg-purple-600 hover:bg-purple-700"
          } text-white py-3 rounded-md text-lg font-medium shadow-md shadow-purple-300/40 dark:shadow-purple-900/40 transition`}
        >
          {loading ? "Creating Account..." : "Sign Up"}
        </button>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
          Already have an account?{" "}
          <NavLink
            to="/login"
            className="text-purple-700 dark:text-purple-400 font-medium hover:underline"
          >
            Login
          </NavLink>
        </p>
      </form>
    </main>
  );
};

export default Signup;
