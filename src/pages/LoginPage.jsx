import React, { useState } from "react";
import { loginUser, SignInWithGoogle } from "../API/userAPI.js";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi";
import Logo from "../assets/images/Logo.svg";

export default function LoginPage() {
  const [loginData, setLoginData] = useState({
    usernameOremail: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("idle");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    setStatus("submitting");
    loginUser(loginData)
      .then((data) => {
        setStatus("idle");
        const RedirectTo = sessionStorage.getItem("redirectAfterLogin") || "/";
        sessionStorage.removeItem("redirectAfterLogin");
        navigate(RedirectTo);
        window.location.reload();
        localStorage.setItem("isAuthenticated", true);
      })
      .catch((error) => {
        localStorage.setItem("loggedIn", false);
        setError(error.message || "Login failed");
        setStatus("idle");
      });
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="flex flex-col items-center self-center">
      <div className="items-center text-center mt-10">
        <div className="w-auto">
          <img src={Logo} alt="Musify" className="w-full" />
        </div>
        <h1 className="text-4xl font-bold pb-9 text-white">Login</h1>
        <form onSubmit={handleSubmit} className="form">
          <div className="flex flex-col">
            <input
              type="text"
              className="border-2 p-2 m-2 bg-transparent shadow-lg text-white border-slate-800 rounded-lg w-80"
              placeholder="Username or Email"
              onChange={handleChange}
              name="usernameOremail"
              value={loginData.usernameOremail}
            />
            <div className="relative w-80">
              <input
                type={passwordVisible ? "text" : "password"}
                className="border-2 p-2 m-2 bg-transparent shadow-lg text-white border-slate-800 rounded-lg w-full pr-10"
                placeholder="Password"
                onChange={handleChange}
                name="password"
                value={loginData.password}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-400"
              >
                {passwordVisible ? (
                  <HiOutlineEyeOff size={20} />
                ) : (
                  <HiOutlineEye size={20} />
                )}
              </button>
            </div>
            <button
              className="bg-blue-400 p-2 m-2 rounded"
              disabled={status === "submitting"}
            >
              {status === "submitting" ? "Logging in..." : "Login"}
            </button>
            <h1 className="text-lg text-white">or</h1>
          </div>
        </form>

        {error && <p className="text-red-500">{error}</p>}
        <h3 className="text-white mt-2">
          Don't have an account?{" "}
          <NavLink to="/register" className="text-blue-600">
            {" "}
            Register{" "}
          </NavLink>{" "}
          Here
        </h3>
      </div>
    </div>
  );
}
