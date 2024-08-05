import React, { useState } from "react";
import { registerUser } from "../API/userAPI.js";
import { useNavigate, NavLink } from "react-router-dom";
import { HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi";
import Logo from "../assets/images/Logo.svg";

export default function RegisterPage() {
  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    fullName: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("idle");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();

  localStorage.setItem("loggedIn", false);

  function validateInput() {
    const { username, password } = registerData;
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (username.length < 3) {
      return "Username must be greater than 3 characters.";
    }
    if (username.length > 16) {
      return "Username must be less than 16 characters.";
    }
    if (password.length < 6) {
      return "Password must be greater than 6 characters.";
    }
    if (!usernameRegex.test(username)) {
      return "Username must not contain spaces or special characters.";
    }
    return null;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const validationError = validateInput();
    if (validationError) {
      setError(validationError);
      return;
    }
    setStatus("submitting");

    registerUser(registerData)
      .then((data) => {
        console.log(data);
        setStatus("idle");
        navigate("/");
        localStorage.setItem("isAuthenticated", true);
        window.location.reload();
      })
      .catch((error) => {
        setError(error.message);
        setStatus("idle");
      });
  }

  const handleChange = (e) => {
    const { name, value } = e.target;

    setRegisterData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setError(null);
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="flex flex-col items-center self-center text-white">
      <div className="items-center text-center mt-5">
        <div className="w-auto">
          <img src={Logo} alt="Musify" className="w-full" />
        </div>
        <h1 className="text-4xl font-bold pb-9">Register</h1>
        <p>Fill all the details</p>
        {error && <p className="text-red-500 w-80">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col">
            <input
              type="text"
              className="border-2 p-2 m-2 border-slate-800 rounded-lg bg-transparent w-80"
              placeholder="Username"
              onChange={handleChange}
              name="username"
              value={registerData.username}
            />
            <input
              type="email"
              className="border-2 p-2 m-2 border-slate-800 rounded-lg bg-transparent w-80"
              placeholder="Email"
              onChange={handleChange}
              name="email"
              value={registerData.email}
            />
            <input
              type="text"
              className="border-2 p-2 m-2 border-slate-800 rounded-lg bg-transparent w-80"
              placeholder="Full Name"
              onChange={handleChange}
              name="fullName"
              value={registerData.fullName}
            />
            <div className="relative">
              <input
                type={passwordVisible ? "text" : "password"}
                className="border-2 p-2 m-2 border-slate-800 rounded-lg bg-transparent w-80 pr-10"
                placeholder="Password"
                onChange={handleChange}
                name="password"
                value={registerData.password}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 mr-5 flex items-center px-2 text-gray-400"
              >
                {passwordVisible ? (
                  <HiOutlineEyeOff size={20} />
                ) : (
                  <HiOutlineEye size={20} />
                )}
              </button>
            </div>
            <button
              className="bg-blue-400 p-2 m-2 rounded text-black"
              disabled={status === "submitting"}
            >
              {status === "submitting" ? "Creating ..." : "Create Account"}
            </button>
            <h1 className="mb-1">or</h1>
            <button type="button" className="login-with-google-btn">
              Continue with Google
            </button>
          </div>
        </form>

        <h3 className="mt-2">
          Already have an account?{" "}
          <NavLink to="/login" className="text-blue-600">
            Login
          </NavLink>{" "}
          here
        </h3>
      </div>
    </div>
  );
}
