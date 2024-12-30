import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { backendUrl } from "../../backendUrl";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const handleEmailInput = (e) => setEmail(e.target.value);
  const handlePasswordInput = (e) => setPassword(e.target.value);

  const handleLoginClick = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Email and password are required.");
      return;
    }

    if (
      password.length < 8 ||
      !/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&#]{8,}$/.test(password)
    ) {
      alert(
        "Password must be at least 8 characters and include letters and numbers."
      );
      return;
    }

    const userData = { email: email, password: password };
    try {
      const res = await axios.post(`${backendUrl}/api/login/`, userData);
      if (res.status === 200) {
        const userResData = {
          token: res.data.token,
          userId: res.data.userId,
        };
        alert("Login successful!");
        localStorage.setItem("user", JSON.stringify(userResData));
        navigate("/");
      }
    } catch (error) {
      const err = error.response.data.message;
      setError(err);
      alert(err);
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        <form className="space-y-4" onSubmit={handleLoginClick}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={handleEmailInput}
              className="mt-1 w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={handlePasswordInput}
              className="mt-1 w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <p className="text-red-600 text-lg">{error}</p>
          <button
            type="submit"
            className="w-full bg-black text-white py-2 px-4 rounded-md  transition duration-300"
          >
            Login
          </button>
        </form>
        <p className="text-center mt-2">New user?<Link to="/registration"><span className="text-blue-500 hover:underline">Create account first</span></Link></p>
      </div>
    </div>
  );
};

export default Login;
