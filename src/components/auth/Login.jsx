import { useState } from "react";
import axios from "axios";

function LoginWithUserData() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "https://dummyjson.com/auth/login",
        {
          username,
          password,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      const token = response.data.token;
      localStorage.setItem("accessToken", token);

      // Fetch user data using token
      const me = await fetch("https://dummyjson.com/auth/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const userData = await me.json();
      setUser(userData);
      setError("");
    } catch (err) {
      setError("Login gagal. Cek username/password.");
      console.error(err);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label>Username</label>
          <input
            type="text"
            className="border w-full px-2 py-1"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            className="border w-full px-2 py-1"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Login
        </button>
      </form>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {user && (
        <div className="mt-6 p-4 border bg-gray-50">
          <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
          <p><strong>Email:</strong> {user.email}</p>
        </div>
      )}
    </div>
  );
}

export default LoginWithUserData;
