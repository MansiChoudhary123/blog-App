import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { backendUrl } from "../../backendUrl";
const Registration = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const handleFirstNameInput = (e) => setFirstName(e.target.value);
  const handleLastNameInput = (e) => setLastName(e.target.value);
  const handleEmailInput = (e) => setEmail(e.target.value);
  const handlePhoneInput = (e) => setPhone(e.target.value);
  const handlePasswordInput = (e) => setPassword(e.target.value);

  const handleRegisterClick = async (e) => {
    e.preventDefault();
    if (!firstName || !lastName || !phone || !email || !password) {
      alert("All fields are required!");
      return;
    }

    if (phone.length !== 10 || !/^[6-9]\d{9}$/.test(phone)) {
      alert("Please enter a valid 10-digit phone number.");
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

    const userData = { firstName, lastName, phone, email, password };
    try {
      const response = await axios.post(
        `${backendUrl}/api/register/`,
        userData
      );
      if (response.status === 201) {
        const userResData = {
          token: response.data.token,
          userId: response.data.userId,
        };
        localStorage.setItem("user", JSON.stringify(userResData));
        alert("Registration successful!");
        navigate("/");
      } else {
        console.log(response);
        alert("Registration Failed");
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
        <h2 className="text-2xl font-bold text-center mb-6">Register</h2>
        <form className="space-y-4" onSubmit={handleRegisterClick}>
          <div className="flex gap-4">
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700"
              >
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={handleFirstNameInput}
                className="mt-1 w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-700"
              >
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                value={lastName}
                onChange={handleLastNameInput}
                className="mt-1 w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>
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
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700"
            >
              Phone
            </label>
            <input
              type="number"
              id="phone"
              value={phone}
              onChange={handlePhoneInput}
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
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Registration;
